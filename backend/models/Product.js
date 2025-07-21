const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả']
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục']
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: {
    type: [String],
    default: []
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rate: {
    type: Number,
    default: 0
  },
  feedbacks: [feedbackSchema]
}, { timestamps: true });



module.exports = mongoose.model('Product', productSchema);
