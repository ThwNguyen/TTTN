const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {body, validationResult } = require('express-validator');

// POST /api/auth/register
// router.post('/register', register);

// POST /api/auth/login
// router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

router.post('/register', [
  body('name').notEmpty().withMessage('Vui lòng nhập tên người dùng'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone').optional().isString(),
  body('address').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await register(req, res);
});

router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await login(req, res);
});

router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng', error: err.message });
  }
});

module.exports = router;
