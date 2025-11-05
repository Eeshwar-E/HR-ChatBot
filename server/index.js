require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connect } = require('./utils/mongo');
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");
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
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Health endpoint: checks local PHI3 model and reports OpenAI config
app.get('/health', async (req, res) => {
	const phi3Url = process.env.PHI3_URL || 'http://127.0.0.1:11434/api/generate';
	const result = { phi3: { ok: false, detail: null }, openai: { configured: !!process.env.OPENAI_API_KEY } };
	try {
		const r = await axios.post(phi3Url, { model: 'phi3', prompt: 'ping', stream: false }, { timeout: 5000 });
		result.phi3.ok = true;
		result.phi3.detail = typeof r.data === 'object' ? r.data : String(r.data).slice(0, 200);
	} catch (err) {
		result.phi3.detail = err.message;
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
