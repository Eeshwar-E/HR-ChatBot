const axios = require("axios");

// Helper to pause/retry on API errors
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Call Gemini API (Google)
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set.");
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await axios.post(
      url,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      { timeout: 50000 }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) throw new Error("Gemini reply missing.");
    return { text, raw: response.data };
  } catch (err) {
    // Log for backend debugging
    console.error("Gemini Request Error:", err?.response?.data || err.message || err);

    // Friendly message for 503 overloads
    const statusCode = err?.response?.status;
    const backendMessage = err?.response?.data?.error?.message;

    if (statusCode === 503 || backendMessage?.toLowerCase().includes("overloaded")) {
      throw new Error("Gemini is busy, please try again in a few seconds.");
    }

    // Other errors
    throw new Error(
      backendMessage || "Failed to process chat message with Gemini."
    );
  }
};


// Call local phi3 Ollama API
const callPhi3 = async (prompt) => {
  const url = process.env.PHI3URL || "http://127.0.0.1:11434/api/generate";
  try {
    const response = await axios.post(url, {
      model: "phi3",
      prompt,
      stream: false,
    }, { timeout: 60000 });
    const text = response.data.response || response.data?.output?.[0]?.content || "";
    return { text, raw: response.data };
  } catch (err) {
    console.error("Phi3 Request Error:", err?.response?.data || err.message || err);
    throw new Error(
      err?.response?.data?.error?.message ||
      "Failed to process chat message with Phi3."
    );
  }
};

// Get raw response from the selected LLM provider
const getLLMRawResponse = async (prompt, provider) => {
  if (provider === "gemini") return await callGemini(prompt);
  return await callPhi3(prompt);
};

// Convenience wrapper for just the text reply
const getLLMResponseText = async (prompt, provider) => {
  const { text } = await getLLMRawResponse(prompt, provider);
  return text;
};

// Chat with the selected LLM (text only)
const chatWithLLM = async (prompt, provider) => {
  return await getLLMResponseText(prompt, provider);
};

// --- Universal resume result parser ---
function parseLLMSections(text) {
  function extractSection(label, asList = false) {
    if (label !== "Comments") {
      const regex = new RegExp(
        String.raw`(^|\n)\s*${label}\s*:?\s*\n([\s\S]+?)(\n\s*(Score|Strengths|Weaknesses|Comments)\s*:|\n*$)`,
        "i"
      );
      const match = text.match(regex);
      if (!match) return asList ? [] : "";
      let content = match[2].trim();
      if (asList) {
        return content
          .split('\n')
          .map(x => x.replace(/^[-*]\s*/, '').trim())
          .filter(x => x.length > 1 &&
            !/^score\s*:?\s*[0-9.\/ ]*$/i.test(x) &&
            !/^comments?\s*:?/i.test(x)
          );
      }
      return content;
    } else {
      // Comments extraction: capture everything after "Comments:" (header may be inline or on its own)
      const regex = new RegExp(
        String.raw`(^|\n)\s*Comments\s*:?\s*(.*?)(\n|$)`,
        "i"
      );
      // First match: inline single-line comment
      let match = text.match(regex);
      if (match && match[2].trim().length > 0) return match[2].trim();

      // Second try: block-style, everything after "Comments:" until end
      const afterBlock = text.split(/Comments\s*:?/i)[1];
      if (afterBlock) {
        return afterBlock.replace(/^[\r\n:*\-\s]+/, '').trim();
      }
      return "";
    }
  }

  const strengths = extractSection("Strengths", true);
  const weaknesses = extractSection("Weaknesses", true);
  const comments = extractSection("Comments", false);

  let score = 0;
  const scoreMatch = text.match(/score\s*[:\-]?\s*\(?([0-9.]+)/i);
  if (scoreMatch && parseFloat(scoreMatch[1]) > 0) {
    score = parseFloat(scoreMatch[1]);
  }

  return { strengths, weaknesses, score, comments };
}




// Resume evaluation (called by UploadController)
const evaluateCandidate = async (resumeText, role, provider = "phi3") => {
  // Do NOT change your prompt
  const prompt = `You are an HR system. Evaluate the following resume for the job role of "${role}".
Provide each section with a clear heading as shown. (follow only this format for resume evaluation and carefully proofread your output for spelling, typos, or accidental random characters. Do not include any broken words or stray letters.)


Score: (#.# out of 10)


Strengths:
- (list five strengths, one per line, each starting with "- ")


Weaknesses:
- (list five weaknesses, one per line, each starting with "- ")


Comments:
(your concise summary)

Resume:
${resumeText}`;
  const resp = await getLLMRawResponse(prompt, provider);
  const replyText = resp.text || resp; // handle both object and string
  return parseLLMSections(replyText); // always returns { strengths, weaknesses, score, comments }
};

module.exports = {
  chatWithLLM,
  getLLMRawResponse,
  getLLMResponseText,
  evaluateCandidate
};
