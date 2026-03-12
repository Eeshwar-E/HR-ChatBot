require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connect } = require('./utils/mongo');
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
// chat functionality removed from UI; keep routes if needed later
// const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const axios = require('axios');

// Add this debug route
app.get('/debug', (req, res) => {
  res.json({ 
    env: {
      mongodb: process.env.MONGODB_URI ? 'set' : 'not set',
      jwt: process.env.JWT_SECRET ? 'set' : 'not set',
      openai: process.env.OPENAI_API_KEY ? 'set' : 'not set'
    }
  });
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Mount routes
app.use("/upload", uploadRoutes);
// chat endpoints are still available but not linked from the frontend
// app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Health endpoint: checks Gemini API and reports config
app.get('/health', async (req, res) => {
	const result = { gemini: { ok: false, detail: null } };
	if (!process.env.GEMINI_API_KEY) {
		result.gemini.ok = false;
		result.gemini.detail = 'GEMINI_API_KEY not set';
		return res.json(result);
	}
	try {
		const geminUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
		const r = await axios.post(geminUrl, { contents: [{ role: 'user', parts: [{ text: 'ping' }] }] }, { timeout: 5000 });
		result.gemini.ok = true;
		result.gemini.detail = 'Gemini API is accessible';
	} catch (err) {
		result.gemini.detail = err.message;
	}
	res.json(result);
});

const start = async () => {
	try {
		await connect();
		const port = process.env.PORT || 5000;
		app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
	} catch (err) {
		console.error('Failed to start server:', err.message);
		process.exit(1);
	}
};

start();
