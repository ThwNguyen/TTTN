import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import banner from '../../assets/banner.png';

export default function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { _id: 'all', name: 'Tất cả' }
  ]);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories([{ _id: 'all', name: 'Tất cả' }, ...data]);
      })
      .catch(() => setCategories([{ _id: 'all', name: 'Tất cả' }]));
  }, []);

  // Fetch products from backend
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  // Filter products
  const filteredProducts =
    selectedCategory === 'all'
      ? [...products].sort((a, b) => b.orders - a.orders)
      : products.filter(p => p.category === selectedCategory);

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.bannerWrap}>
        <img src={banner} alt="Banner" style={styles.banner} />
      </div>

      {/* CATEGORY */}
      <div style={styles.categoryRow}>
        {categories.map(cat => (
          <button
            key={cat._id}
            style={{
              ...styles.categoryBtn,
              background: selectedCategory === cat._id ? '#e5c49b' : '#fff',
              color: selectedCategory === cat._id ? '#111' : '#333',
              borderColor: selectedCategory === cat._id ? '#bfa06e' : '#ccc'
            }}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      <div style={styles.productList}>
        {filteredProducts.map(product => (
          <div
            key={product._id}
            style={{ ...styles.productCard, cursor: 'pointer' }}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div style={styles.productImg}>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={styles.realImg}
                />
              ) : (
                <span style={styles.imgPlaceholder}>Ảnh</span>
              )}
            </div>
            <div style={styles.productName}>{product.name}</div>
            <div style={styles.productPrice}>{formatCurrency(product.price)}</div>
            <div style={styles.ratingStars}>{renderStars(product.rate || 0)}</div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

// Render rate (1-5 sao)
function renderStars(rate) {
  const full = Math.floor(rate);
  const half = rate % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array(full).fill('★').map((s, i) => (
        <span key={'full' + i} style={{ color: '#f5a623' }}>{s}</span>
      ))}
      {half && <span style={{ color: '#f5a623' }}>☆</span>}
      {Array(empty).fill('☆').map((s, i) => (
        <span key={'empty' + i}>{s}</span>
      ))}
    </div>
  );
}

// Format tiền
function formatCurrency(price) {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '';
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, rgb(99, 169, 204), #f1e5af)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  bannerWrap: {
    width: '100%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid #eee',
    marginBottom: 12,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
  },
  categoryRow: {
    display: 'flex',
    gap: 16,
    padding: '0 5%',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '8px 20px',
    borderRadius: 20,
    border: '2px solid #ccc',
    background: '#fff',
    fontWeight: 500,
    fontSize: 16,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
  },
  productList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 32,
    justifyContent: 'flex-start',
    padding: '0 5% 40px 5%',
    minHeight: 300,
    width: '100%',
    boxSizing: 'border-box',
  },
  productCard: {
    width: 180,
    background: '#fff',
    border: '1.5px solid #e5c49b',
    borderRadius: 8,
    padding: 16,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  productImg: {
    width: 120,
    height: 120,
    background: '#eee',
    borderRadius: 6,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  realImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  imgPlaceholder: {
    color: '#aaa',
    fontSize: 18,
  },
  productName: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 4,
    color: '#111',
    textAlign: 'center',
  },
  productPrice: {
    fontWeight: 600,
    color: '#8d6748',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
  },
  ratingStars: {
    fontSize: 14,
    color: '#f5a623',
  },
};
