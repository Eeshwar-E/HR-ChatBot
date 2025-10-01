const { chatWithLLM } = require('./llmController');

/**
 * Builds a formatted chat transcript from history array
 * @param {Array} history - array of message objects { sender: 'user'|'bot', text: string }
 * @returns {string} formatted conversation for prompt
 */
const buildTranscript = (history = []) => {
  return history
    .map(msg =>
      msg.sender === 'user'
        ? `User: ${msg.text}`
        : `Bot: ${msg.text}`
    )
    .join('\n');
};

/**
 * Handles incoming chat requests from frontend
 * Combines resume evaluation and full multi-turn chat history
 * to build a context-aware prompt for the LLM.
 */
const handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmedMsg = message.trim();
    const hasEval = context?.evaluation && context.evaluation.trim().length > 0;
    const transcript = buildTranscript(context?.history || []);

    // Construct prompt for LLM
    let prompt = '';

    if (hasEval) {
      // Include evaluation and full transcript
      prompt =
        `You are an AI assistant. Below is your previous evaluation of a candidate's resume:\n"${context.evaluation.trim()}"\n\n` +
        `Below is the conversation so far between the user and you:\n${transcript}\n\n` +
        `Now, respond helpfully to the user's latest message:\n"${trimmedMsg}"\n\n` +
        `Bot:`;
    } else {
      // No evaluation, use only transcript and user message
      prompt =
        `${transcript}\n\nUser: ${trimmedMsg}\n\nBot:`;
    }

    console.log("Prompt sent to LLM:\n", prompt);

    const reply = await chatWithLLM(prompt);

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to process chat message." });
  }
};

module.exports = { handleChat };
