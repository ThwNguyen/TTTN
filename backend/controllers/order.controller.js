const Order = require('../models/Order');
const Product = require('../models/Product');

// [POST] /api/orders - Tạo đơn hàng mới (user)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddr, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Đơn hàng không có sản phẩm' });
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const populatedItems = [];

    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].product);
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      if (product.stock < items[i].quantity) {
        return res.status(400).json({ message: `Sản phẩm "${product.name}" không đủ hàng` });
      }

      // Trừ tồn kho (nếu bạn muốn)
      product.stock -= items[i].quantity;
      await product.save();

      const price = product.price;
      totalAmount += price * items[i].quantity;

      populatedItems.push({
        product: product._id,
        quantity: items[i].quantity,
        price
      });
    }

    const newOrder = new Order({
      user: req.user._id,
      items: populatedItems,
      shippingAddr,
      paymentMethod,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Đặt hàng thành công', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate({
      path: 'items.product',
      select: 'name price images'
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy đơn hàng của bạn', error: err.message });
  }
};

const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    // Chỉ cho người đặt đơn mới được thanh toán
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền thanh toán đơn này' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();

    res.json({ message: 'Thanh toán thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thanh toán đơn hàng', error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn này' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: `Không thể hủy đơn ở trạng thái "${order.status}"` });
    }

    // ✅ Trả lại tồn kho
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Đã hủy đơn hàng thành công và hoàn lại tồn kho', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi hủy đơn hàng', error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, from, to } = req.query;

    const filter = {};

    // Lọc theo trạng thái (giữ lại nếu đang có)
    if (status) {
      const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }
      filter.status = status;
    }

    // ✅ Lọc theo thời gian tạo đơn
    if (from || to) {
      filter.createdAt = {};
      if (from) {
        filter.createdAt.$gte = new Date(from);
      }
      if (to) {
        // Đảm bảo lấy hết ngày đó (23:59:59)
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lọc đơn hàng', error: err.message });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Cập nhật trạng thái đơn thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn', error: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  payOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};