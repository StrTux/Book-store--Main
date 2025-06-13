const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// All cart routes are protected
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/items/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router; 