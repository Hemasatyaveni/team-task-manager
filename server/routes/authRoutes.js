const express = require('express');
const authMiddleware = require('../middleware/auth');
const { signupValidator, loginValidator } = require('../validators/authValidator');
const { signup, login, profile } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/profile', authMiddleware, profile);

module.exports = router;
