import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/header';
import { CartContext } from '../../contexts/cart.context.jsx';

const Order = () => {
  const { fetchCart } = useContext(CartContext);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart(); 
        setCartData(data);
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [fetchCart]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!cartData || cartData.cart.length === 0) return <p>Giỏ hàng trống</p>;

  return (
    <div>
      <Header />
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2>Đơn hàng của bạn</h2>

        {cartData.cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ccc',
              padding: '10px 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={item.product.images[0] || 'https://via.placeholder.com/80'}
                alt={item.product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div>
                <h4>{item.product.name}</h4>
                <p>{item.product.price.toLocaleString()} đ</p>
              </div>
            </div>
            <div>
              SL: {item.quantity}
            </div>
          </div>
        ))}

        <h3 style={{ textAlign: 'right', marginTop: '20px' }}>
          Tổng cộng: {cartData.totalPrice.toLocaleString()} đ
        </h3>

        <button
          style={{
            display: 'block',
            margin: '20px auto 0',
            backgroundColor: '#e2bb95',
            color: '#2d1c07',
            padding: '10px 20px',
            fontSize: '16px',
            border: '2px solid #2d1c07',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Order;
