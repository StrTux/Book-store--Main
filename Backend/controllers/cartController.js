const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Add item to cart
// @route   POST /api/carts
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check stock
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  // Find user's cart or create one
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart if doesn't exist
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalAmount: 0,
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // Save updated cart
  await cart.save();

  // Return populated cart
  const updatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name image price'
  );

  res.status(200).json(updatedCart);
});

// @desc    Get user's cart
// @route   GET /api/carts
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name image price stock'
  );

  if (!cart) {
    // Return empty cart
    return res.status(200).json({
      _id: null,
      items: [],
      totalAmount: 0,
    });
  }

  res.status(200).json(cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/carts/items/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Check stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  // Update quantity
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  // Save cart
  await cart.save();

  // Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name image price stock'
  );

  res.status(200).json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/carts/items/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Find item index
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Remove item
  cart.items.splice(itemIndex, 1);

  // Save cart
  await cart.save();

  // Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name image price'
  );

  res.status(200).json(updatedCart);
});

// @desc    Clear cart
// @route   DELETE /api/carts
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({
      message: 'Cart is already empty',
    });
  }

  // Clear items
  cart.items = [];

  // Save cart
  await cart.save();

  res.status(200).json({
    message: 'Cart cleared successfully',
    cart,
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}; 