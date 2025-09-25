const axios = require("axios");

const evaluateCandidate = async (resumeText, role) => {
  const prompt = `You are an HR system. Evaluate the following resume for the job role of ${role}.
Present your answer in this clear format:
- Strengths: (list 5 points)
- Weaknesses: (list 5 points)
- Score: (a float number out of 10)
- Comments: (provide it in a concise paragraph)
Resume:
${resumeText}`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
    stream: false
  });

  return response.data.response;
};

const chatWithLLM = async (prompt) => {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
    stream: false
  });

  return response.data.response;
};

module.exports = { evaluateCandidate, chatWithLLM };
