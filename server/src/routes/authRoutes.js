const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', authController.login);
router.get('/profile', protect, authController.getMe); // get /api/auth/profile

module.exports = router;