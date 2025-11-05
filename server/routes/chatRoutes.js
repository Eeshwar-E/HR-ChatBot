const express = require("express");
const router = express.Router();
const { handleChat, getChatHistory } = require("../controllers/chatController");
const auth = require('../middleware/auth');

// Protected chat endpoints - require authentication
router.post("/", auth, handleChat);
router.get("/history", auth, getChatHistory);

module.exports = router;
