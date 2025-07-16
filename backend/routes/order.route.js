const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { createOrder, 
    getMyOrders, 
    payOrder, 
    cancelOrder, 
    getAllOrders, 
    updateOrderStatus, 
    getOrderStats, 
    getDailyRevenue, 
    getMonthlyRevenue } = require('../controllers/order.controller');

// Tạo đơn hàng
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.get('/stats', protect, isAdmin, getOrderStats);
router.get('/stats/daily', protect, isAdmin, getDailyRevenue);
router.get('/stats/monthly', protect, isAdmin, getMonthlyRevenue);
module.exports = router;
