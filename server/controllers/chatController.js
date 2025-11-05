const { chatWithLLM, getLLMRawResponse } = require('./llmController');
const Chat = require('../models/Chat');
const Evaluation = require('../models/Evaluation');

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
    
    // If we have an evaluation ID in context, fetch it
    let evaluation = null;
    if (context?.evaluationId) {
      evaluation = await Evaluation.findOne({ 
        _id: context.evaluationId,
        user: req.user._id 
      });
    }

    // Get or create chat document for this user
    const chatDoc = await Chat.findOne({ user: req.user._id }) || new Chat({ user: req.user._id });
    
    // Build transcript from stored messages
    const transcript = buildTranscript(chatDoc.messages);

    // Construct prompt for LLM
    let prompt = '';

    if (evaluation) {
      // Include evaluation and full transcript
      prompt =
        `You are an AI assistant. Below is your previous evaluation of a candidate's resume:\n"${evaluation.comments}"\n\n` +
        `Strengths: ${evaluation.strengths.join(', ')}\n` +
        `Weaknesses: ${evaluation.weaknesses.join(', ')}\n` +
        `Score: ${evaluation.score}/10\n\n` +
        `Below is the conversation so far between the user and you:\n${transcript}\n\n` +
        `Now, respond helpfully to the user's latest message:\n"${trimmedMsg}"\n\n` +
        `Bot:`;
    } else {
      // No evaluation, use only transcript and user message
      prompt =
        `${transcript}\n\nUser: ${trimmedMsg}\n\nBot:`;
    }

  // Only log when debugging enabled to avoid exposing sensitive data
  if (process.env.LLM_DEBUG === 'true') {
    console.log("Prompt sent to LLM (truncated):\n", prompt.slice(0, 500));
  }

  const provider = req.user?.modelPreference || process.env.LLM_PROVIDER || 'phi3';
  // Get raw response so we can optionally return metadata when debugging
  const llmResult = await getLLMRawResponse(prompt, provider);
  const reply = llmResult?.text || '';

    // Add the new messages
    chatDoc.messages.push(
      { sender: 'user', text: trimmedMsg },
      { sender: 'bot', text: reply }
    );
    
    // Update the timestamp
    chatDoc.updatedAt = new Date();
    
    await chatDoc.save();

    const responsePayload = { reply, messageId: chatDoc.messages[chatDoc.messages.length - 1]._id };
    if (process.env.LLM_DEBUG === 'true') {
      // include provider and raw LLM response for debugging (controlled by env)
      responsePayload.llm = { provider, raw: llmResult?.raw };
    }

    res.json(responsePayload);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to process chat message.", detail: err.message });
  }
};

/**
 * Get chat history for the authenticated user
 */
const getChatHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 messages
    const skip = parseInt(req.query.offset) || 0;
    
    const chat = await Chat.findOne({ user: req.user._id })
      .select('messages updatedAt')
      .slice('messages', [skip, limit]); // Get a slice of messages
    
    if (!chat) {
      return res.json({ messages: [], total: 0 });
    }
    
    // Get total count for pagination
    const total = chat.messages.length;
    
    res.json({
      messages: chat.messages,
      total,
      hasMore: total > (skip + limit)
    });
  } catch (err) {
    console.error("Get history error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

module.exports = { handleChat, getChatHistory };
