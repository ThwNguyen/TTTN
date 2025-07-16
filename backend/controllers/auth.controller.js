const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

// [POST] /api/auth/register
const register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phone, address } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi đăng ký', error: err.message });
    }
};

// [POST] /api/auth/login
const login = async (req, res) => {

     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // Kiểm tra tài khoản bị khóa
        if (!user.isActive) return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

        // Tạo JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        // Trả cookie + user info
            res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false // đặt thành true nếu dùng HTTPS
        });

        res.json({
            message: 'Đăng nhập thành công',
            user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
      }
    });
  } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: err.message });
  }
};

// [POST] /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đăng xuất thành công' });
};

module.exports = { register, login, logout };
