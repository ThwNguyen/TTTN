import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const query = useQuery().get('query') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/products/search?search=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        // Show error instead of redirecting
        alert('Có lỗi xảy ra khi tìm kiếm sản phẩm');
      });
  }, [query]);

  return (
    <div>
      <Header />
      <div style={{ padding: 32 }}>
        <h2>Kết quả tìm kiếm cho: <span style={{ color: '#8d6748' }}>{query}</span></h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : products.length === 0 ? (
          <div>Không tìm thấy sản phẩm nào.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {products.map(product => (
              <div key={product._id} style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                width: 220,
                background: '#fff'
              }}>
                <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ fontWeight: 600, margin: '8px 0', color: '#111' }}>{product.name}</div>
                <div style={{ color: '#8d6748', marginBottom: 8 }}>Giá: {product.price?.toLocaleString()} đ</div>
                <a href={`/product/${product._id}`} style={{ color: '#007bff' }}>Xem chi tiết</a>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

