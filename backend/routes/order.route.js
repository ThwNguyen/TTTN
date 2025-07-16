const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { createOrder, getMyOrders, payOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');

// Tạo đơn hàng
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
