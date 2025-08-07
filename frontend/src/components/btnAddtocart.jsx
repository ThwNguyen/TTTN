import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/cart.context.jsx';
import { useNavigate } from 'react-router-dom';

const btnStyle = {
  background: '#e5c49b',
  border: '2px solid #222',
  borderRadius: 8,
  color: '#222',
  fontWeight: 500,
  fontSize: 20,
  padding: '10px 32px',
  cursor: 'pointer',
  transition: 'background 0.2s',
  margin: '8px 0',
};

export default function BtnAddToCart({ product, qty = 1 }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showMsg, setShowMsg] = useState(false);

  const handleClick = async () => {
    await addToCart(product, qty);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 1200); // Show notification for 1.2s then go to cart
  };

  return (
    <>
      <button style={btnStyle} onClick={handleClick}>
        Thêm vào giỏ hàng
      </button>
      {showMsg && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 40,
          background: '#e5c49b',
          color: '#222',
          border: '2px solid #222',
          borderRadius: 8,
          padding: '12px 32px',
          fontSize: 18,
          fontWeight: 600,
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          {`Đã thêm ${qty} sản phẩm vào giỏ`}
        </div>
      )}
    </>
  );
}