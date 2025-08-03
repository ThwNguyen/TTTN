import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div>Loading...</div>;

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
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span style={{ margin: '0 8px' }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <div style={styles.stock}>Còn hàng: {product.stock || 0}</div>
          <div style={styles.btnRow}>
            <button style={styles.btn}>Thêm vào giỏ hàng</button>
            <button style={styles.btn}>Mua ngay</button>
          </div>
        </div>
      </div>
      <div style={styles.detailSection}>
        <div>
          <b>Đánh giá</b>
        </div>
        <div style={{ margin: '8px 0' }}>{renderStars(product.rate || 0)}</div>
        <div>
          <b>Mô tả chi tiết</b>
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
    <span>
      {Array(full).fill('★').map((s, i) => (
        <span key={'full' + i} style={{ color: '#f5a623' }}>{s}</span>
      ))}
      {half && <span style={{ color: '#f5a623' }}>☆</span>}
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
  container: { display: 'flex', padding: 32, gap: 32, justifyContent: 'center' },
  left: { flex: '0 0 320px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { width: 320, height: 320, objectFit: 'contain', background: '#eee', borderRadius: 8 },
  right: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: 300 },
  name: { fontSize: 32, marginBottom: 16 },
  price: { fontSize: 20, marginBottom: 16, color: '#8d6748', fontWeight: 600 },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  stock: { marginBottom: 16 },
  btnRow: { display: 'flex', gap: 16, marginBottom: 16 },
  btn: { padding: '10px 24px', border: '2px solid #222', background: '#fff', fontWeight: 500, cursor: 'pointer', borderRadius: 6 },
  detailSection: { maxWidth: 800, margin: '0 auto 32px auto', padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  textarea: { width: '100%', minHeight: 60, marginTop: 8, borderRadius: 6, border: '1px solid #ccc', padding: 8, resize: 'vertical', fontSize: 16 }
};