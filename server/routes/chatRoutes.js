const express = require("express");
const router = express.Router();
const { handleChat, getChatHistory } = require("../controllers/chatController");
const auth = require('../middleware/auth');

router.post("/", auth, handleChat);
router.get("/history", auth, getChatHistory);

module.exports = router;
