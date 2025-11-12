const { chatWithLLM, getLLMRawResponse } = require('./llmController');
const Chat = require('../models/Chat');
const Evaluation = require('../models/Evaluation');

const buildTranscript = (history = []) => {
  return history
    .map(msg => (msg.sender === 'user' ? `User: ${msg.text}` : `Bot: ${msg.text}`))
    .join('\n');
};

const handleChat = async (req, res) => {
  try {
    const { message, context, model } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    const trimmedMsg = message.trim();

    let evaluation = null;
    if (context?.evaluationId) {
      evaluation = await Evaluation.findOne({ 
        _id: context.evaluationId,
        user: req.user._id 
      });
    }

    let chatDoc = await Chat.findOne({ user: req.user._id, model });
    if (!chatDoc) {
      chatDoc = new Chat({ user: req.user._id, model, messages: [] });
    }

    const transcript = buildTranscript(chatDoc.messages);

    let prompt = '';

    if (evaluation) {
      prompt =
        `You are an AI assistant. Below is your previous evaluation of a candidate's resume:\n"${evaluation.comments}"\n\n` +
        `Strengths: ${evaluation.strengths.join(', ')}\n` +
        `Weaknesses: ${evaluation.weaknesses.join(', ')}\n` +
        `Score: ${evaluation.score}/10\n\n` +
        `Below is the conversation so far between the user and you:\n${transcript}\n\n` +
        `Now, respond helpfully to the user's latest message:\n"${trimmedMsg}"\n\n` +
        `Bot:`;
    } else {
      prompt = `${transcript}\n\nUser: ${trimmedMsg}\n\nBot:`;
    }

    if (process.env.LLM_DEBUG === 'true') {
      console.log("Prompt sent to LLM (truncated):\n", prompt.slice(0, 500));
    }

    const provider = model || req.user?.modelPreference || process.env.LLMPROVIDER || "phi3";
    const llmResult = await getLLMRawResponse(prompt, provider);
    const reply = llmResult?.text || '';

    chatDoc.messages.push(
      { sender: 'user', text: trimmedMsg },
      { sender: 'bot', text: reply }
    );
    chatDoc.updatedAt = new Date();

    await chatDoc.save();

    const responsePayload = { reply, messageId: chatDoc.messages[chatDoc.messages.length - 1]._id };
    if (process.env.LLM_DEBUG === 'true') {
      responsePayload.llm = { provider, raw: llmResult?.raw };
    }

    res.json(responsePayload);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to process chat message.", detail: err.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { model } = req.query;
    if (!model) return res.status(400).json({ error: "Model parameter required." });

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = parseInt(req.query.offset) || 0;

    const chat = await Chat.findOne({ user: req.user._id, model })
      .select('messages updatedAt')
      .slice('messages', [skip, limit]);

    if (!chat) {
      return res.json({ messages: [], total: 0 });
    }

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
