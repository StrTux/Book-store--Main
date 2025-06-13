const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.route('/:id')
  .get(protect, getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

// Admin routes
router.get('/', protect, admin, getReviews);

module.exports = router; 