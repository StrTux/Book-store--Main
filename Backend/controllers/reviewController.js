const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // Create new review
  const review = await Review.create({
    rating: Number(rating),
    comment,
    user: req.user._id,
    product: productId,
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name email')
    .populate('product', 'name image');
  res.json(reviews);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  if (reviews.length > 0) {
    res.json(reviews);
  } else {
    res.status(404);
    throw new Error('No reviews found for this product');
  }
});

// @desc    Get a review by ID
// @route   GET /api/reviews/:id
// @access  Private/Admin
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name email')
    .populate('product', 'name image');

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (review) {
    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('You can only update your own reviews');
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    // Check if review belongs to user or if user is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('You can only delete your own reviews');
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

module.exports = {
  createReview,
  getReviews,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
}; 