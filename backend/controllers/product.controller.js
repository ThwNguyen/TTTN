const Product = require('../models/Product');
const express = require('express');
const Category = require('../models/Category');

// [GET] /api/products?keyword=...&category=...

const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isFeatured,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const queryObj = {};

    // Tìm kiếm theo tên
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }

    // Lọc theo category
    if (category) {
      queryObj.category = category;
    }

    // Lọc theo nổi bật
    if (isFeatured) {
      queryObj.isFeatured = isFeatured === 'true';
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Sắp xếp
    let sortOption = { createdAt: -1 }; // mặc định mới nhất
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(queryObj);

    const products = await Product.find(queryObj)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('category', 'name'); // lấy tên danh mục

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: err.message });
  }
};



// [GET] /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('feedbacks.user', 'name');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm', error: err.message });
  }
};

// [POST] /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      isFeatured
    } = req.body;

    if (!category) 
      return res.status(400).json({ message: 'Vui lòng chọn danh mục' });
    
    const foundCategory = await Category.findById(category);
    if (!foundCategory) 
      return res.status(400).json({ message: 'Danh mục không tồn tại' });
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      isFeatured
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm', error: err.message });
  }
};

// [DELETE] /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xoá' });

    res.json({ message: 'Đã xoá sản phẩm' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xoá sản phẩm', error: err.message });
  }
};

// [PUT] /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      isFeatured
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.images = images || product.images;
    product.isFeatured = isFeatured ?? product.isFeatured;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm', error: err.message });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    // Kiểm tra nếu user đã từng đánh giá
    const alreadyReviewed = product.feedbacks.find(
      (fb) => fb.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này' });
    }

    // Thêm đánh giá mới
    const feedback = {
      user: req.user._id,
      comment,
      rating: Number(rating),
      createdAt: new Date()
    };

    product.feedbacks.push(feedback);

    // Cập nhật rate trung bình
    const avg =
      product.feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / product.feedbacks.length;
    product.rate = Math.round(avg * 10) / 10;

    await product.save();

    res.status(201).json({ message: 'Đã đánh giá sản phẩm thành công', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đánh giá sản phẩm', error: err.message });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  addFeedback
};

