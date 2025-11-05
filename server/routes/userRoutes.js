const express = require('express');
const router = express.Router();
const { updatePreferences } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Protected user endpoints - require authentication
router.patch('/preferences', auth, updatePreferences);

module.exports = router;