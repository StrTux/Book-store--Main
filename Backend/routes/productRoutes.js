const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router; 