import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { CartContext } from '../../contexts/cart.context.jsx';
import { AuthContext } from '../../contexts/auth.context.jsx';
import BtnAddToCart from '../../components/btnAddtocart.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    await addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.left}>
          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            style={styles.image}
          />
        </div>
        <div style={styles.right}>
          <h2 style={styles.name}>{product.name}</h2>
          <div style={styles.price}>Giá: {formatCurrency(product.price)}</div>
          <div style={styles.row}>
            <span>Số lượng:</span>
            <div style={styles.qtyGroup}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>-</button>
              <span style={styles.qtyValue}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={styles.qtyBtn}>+</button>
            </div>
          </div>
          <div style={styles.stock}>Còn hàng: {product.stock || 0}</div>
          <div style={styles.btnRow}>
            <BtnAddToCart product={product} qty={qty} />
            <button
              style={styles.btn}
              onClick={() => navigate('/order')}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
      <div style={styles.detailSection}>
        <div>
          <b style={{ color: '#111' }}>Đánh giá</b>
        </div>
        <div style={{ margin: '8px 0', color: 'yellow' }}>{renderStars(product.rate || 0)}</div>
        <div>
          <b style={{ color: '#111' }}>Mô tả chi tiết</b>
        </div>
        <textarea
          style={styles.textarea}
          value={product.description || ''}
          readOnly
        />
      </div>
      <Footer />
    </div>
  );
}

function renderStars(rate) {
  const full = Math.floor(rate);
  const half = rate % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span style={{ color: '#111', fontSize: 18 }}>
      {Array(full).fill('★').map((s, i) => (
        <span key={'full' + i} style={{ color: '#FFD700' }}>{s}</span> // yellow star
      ))}
      {half && <span style={{ color: '#FFD700' }}>☆</span>} 
      {Array(empty).fill('☆').map((s, i) => (
        <span key={'empty' + i}>{s}</span>
      ))}
    </span>
  );
}

function formatCurrency(price) {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '';
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(to bottom, rgb(99,169,204), #f1e5af)' },
  container: { 
    display: 'flex', 
    padding: 32, 
    gap: 32, 
    justifyContent: 'center', 
    width: '100vw', // set width to full viewport width
    boxSizing: 'border-box',
},
  left: { flex: '0 0 320px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { width: 320, height: 320, objectFit: 'contain', background: '#eee', borderRadius: 8 },
  right: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: 300 },
  name: { fontSize: 32, marginBottom: 16, color: '#111' }, // product name black
  price: { fontSize: 20, marginBottom: 16, color: '#8d6748', fontWeight: 600 }, // keep price color
  row: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#111' }, // quantity row black
  stock: { marginBottom: 16, color: '#111' }, // stock text black
  btnRow: { display: 'flex', gap: 16, marginBottom: 16 },
  btn: {
    padding: '10px 24px',
    border: '2px solid #222',
    background: '#e5c49b',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 6,
    color: '#111',
    fontSize: 16,
    transition: 'background 0.2s',
  },
  detailSection: { 
    maxWidth: '100vw',
    margin: '0 auto 32px auto', 
    padding: 16, 
    background: '#fff', 
    borderRadius: 8, 
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
    width: '100vw',
    boxSizing: 'border-box',
},
  textarea: { 
    width: '100%', 
    minHeight: 60, 
    marginTop: 8, 
    borderRadius: 6, 
    border: '1px solid #ccc', 
    padding: 8, 
    resize: 'vertical', 
    fontSize: 16,
    background: '#fff',      // <-- Add background color for description
    color: '#111',           // <-- Ensure text is black
},
  qtyGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: 6,
    background: '#fff',
    overflow: 'hidden',
    height: 32, // smaller height
},
  qtyBtn: {
    width: 32, // smaller width
    height: 32, // smaller height
    background: '#f5f5f5',    // very light grey
    color: '#d32f2f',         // red for + and -
    fontSize: 18,             // smaller font
    fontWeight: 700,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, color 0.2s',
    margin: 0,
},
  qtyValue: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: '#d32f2f',
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    background: '#fff',
},
};