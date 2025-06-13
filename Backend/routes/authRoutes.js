const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// Public routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router; 