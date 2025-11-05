const axios = require('axios');

// Small helper to sleep
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Call OpenAI's API with simple retry/backoff for 429s and transient errors
 */
const callOpenAI = async (prompt) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const url = 'https://api.openai.com/v1/chat/completions';
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.post(url, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      });

      // Return both raw and text for callers that want metadata
      return { text: response.data.choices[0].message.content, raw: response.data };
    } catch (err) {
      const status = err?.response?.status;
      // Retry on 429 or network errors
      if (attempt < maxAttempts && (status === 429 || !err.response)) {
        const backoff = Math.pow(2, attempt) * 500;
        console.warn(`OpenAI request failed (attempt ${attempt}) status=${status}. Retrying in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }
      console.error('callOpenAI failed:', err.message || err);
      throw err;
    }
  }
};

/**
 * Call local phi3 (Ollama-hosted) API
 */
const callPhi3 = async (prompt) => {
  // Allow override from environment
  const url = process.env.PHI3_URL || 'http://127.0.0.1:11434/api/generate';
  try {
    const response = await axios.post(url, {
      model: 'phi3',
      prompt,
      stream: false,
    }, { timeout: 60000 });
    // Ollama/phi3 returns { response: '...' } in response.data
    return { text: response.data.response || (response.data?.output?.[0]?.content ?? ''), raw: response.data };
  } catch (err) {
    console.warn('callPhi3 failed, retrying once:', err.message);
    try {
      await sleep(1000);
      const response = await axios.post(url, {
        model: 'phi3',
        prompt,
        stream: false,
      }, { timeout: 60000 });
      return { text: response.data.response || (response.data?.output?.[0]?.content ?? ''), raw: response.data };
    } catch (err2) {
      console.error('callPhi3 retry failed:', err2.message);
      throw err2;
    }
  }
};

/**
 * Get raw response from selected LLM provider (returns { text, raw })
 */
const getLLMRawResponse = async (prompt, provider = 'phi3') => {
  if (provider === 'openai') {
    return await callOpenAI(prompt);
  }
  return await callPhi3(prompt);
};

/**
 * Convenience wrapper that returns only the text reply
 */
const getLLMResponseText = async (prompt, provider = 'phi3') => {
  const { text } = await getLLMRawResponse(prompt, provider);
  return text;
};

/**
 * Evaluate a candidate's resume
 */
const evaluateCandidate = async (resumeText, role, provider = 'phi3') => {
  const prompt = `You are an HR system. Evaluate the following resume for the job role of ${role}.
Present your answer in this clear format:
- Strengths: (list 5 points)
- Weaknesses: (list 5 points)
- Score: (a float number out of 10)
- Comments: (provide it in a concise paragraph)
Resume:
${resumeText}`;

  const { text } = await getLLMRawResponse(prompt, provider);
  return text;
};

/**
 * Chat with the selected LLM (text-only)
 */
const chatWithLLM = async (prompt, provider = 'phi3') => {
  return await getLLMResponseText(prompt, provider);
};

module.exports = { evaluateCandidate, chatWithLLM, getLLMRawResponse, getLLMResponseText };
