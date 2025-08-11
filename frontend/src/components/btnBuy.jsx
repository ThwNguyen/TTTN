
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuyNowButton = () => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/order'); // chuyển tới order.jsx
  };

  return (
    <button
      onClick={handleBuyNow}
      style={{
         top: 80,
         right: 40,
        background: '#e5c49b',
          color: '#222',
          border: '2px solid #222',
          borderRadius: 8,
          padding: '12px 32px',
          fontSize: 20,
          fontWeight: 600,
          zIndex: 9999,
          margin: '8px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}
      onMouseOver={(e) => (e.target.style.opacity = 0.85)}
      onMouseOut={(e) => (e.target.style.opacity = 1)}
    >
      Mua hàng
    </button>
  );
};

export default BuyNowButton;
