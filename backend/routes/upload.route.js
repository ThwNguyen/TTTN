const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

// [POST] /api/upload (admin)
router.post('/', protect, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không có file được tải lên' });
  }

  res.status(201).json({
    message: 'Upload thành công',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
