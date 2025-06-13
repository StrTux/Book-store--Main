const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal that user doesn't exist for security
    return res.status(200).json({
      message: 'If your email is registered, you will receive a password reset link',
    });
  }

  // Generate token and save it to user
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Set token expiry (1 hour from now)
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

  await user.save();

  // In a real application, send email with reset link
  // For demonstration purposes, we'll just return the token
  res.status(200).json({
    message: 'Password reset link sent to email',
    // The following would not be returned in a production app
    // Instead, an email would be sent with a link containing this token
    token: resetToken,
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // Find user with this token and ensure token hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    message: 'Password reset successful',
  });
});

module.exports = {
  forgotPassword,
  resetPassword,
}; 