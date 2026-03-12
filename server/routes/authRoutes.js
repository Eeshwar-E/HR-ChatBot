const express = require('express');
const router = express.Router();
const { register, login, me, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Either use only /register
router.post('/register', register);
// Or, alias for frontend compatibility:
router.post('/signup', register);

router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.get('/me', auth, me);

module.exports = router;
