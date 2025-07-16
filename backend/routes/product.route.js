const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct, 
  addFeedback
} = require('../controllers/product.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

// Public
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/:id/feedback', protect, addFeedback);

// Admin only
router.post('/', protect, isAdmin, createProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.put('/:id', protect, isAdmin, updateProduct);

module.exports = router;
