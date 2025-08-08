import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../contexts/cart.context.jsx';

export default function Cart() {
  const { cart, updateQty, removeFromCart, fetchCart } = useContext(CartContext);
  const [selectAll, setSelectAll] = useState(true);
  const [checkedIds, setCheckedIds] = useState([]);

  useEffect(() => {
    fetchCart(); // Tải giỏ hàng từ server khi load
  }, []);

  useEffect(() => {
    setCheckedIds(cart.map(item => item._id));
    setSelectAll(true);
  }, [cart]);

  const handleQty = (id, delta) => {
    const item = cart.find(i => i._id === id);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      updateQty(id, newQty); // Cập nhật vào database
    }
  };

  const handleCheck = (id) => {
    setCheckedIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedIds([]);
    } else {
      setCheckedIds(cart.map(item => item._id));
    }
    setSelectAll(!selectAll);
  };

  const handleRemove = () => {
    checkedIds.forEach(id => removeFromCart(id));
  };

  const totalItems = checkedIds.length;
  const totalPrice = cart
    .filter(item => checkedIds.includes(item._id))
    .reduce((sum, item) => {
      const price = Number(item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);

  return (
    <div style={{ padding: 24 }}>
      {/* Cart List */}
      <div>
        {cart.map(item => {
          const id = item._id;
          const price = Number(item.product?.price || 0);
          const qty = Number(item.quantity || 1);

          return (
            <div key={id} style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              padding: '16px 0'
            }}>
              <input
                type="checkbox"
                checked={checkedIds.includes(id)}
                onChange={() => handleCheck(id)}
                style={{ marginRight: 12 }}
              />
              <div style={{
                width: 64,
                height: 64,
                border: '2px solid #aaa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
              }}>
                {item.product?.images?.[0]
                  ? <img src={item.product.images[0]} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 32 }}>✕</span>
                }
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.product?.name || 'Sản phẩm'}</div>
                <div style={{ color: '#8d6748', marginTop: 4 }}>Giá: {price.toLocaleString()} đ</div>
              </div>

              {/* Qty Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#c5dde0',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #ccc'
              }}>
                <button onClick={() => handleQty(id, -1)} style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#f5f5f5',
                  color: '#d32f2f',
                  fontSize: 20,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}>−</button>
                <div style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#d32f2f',
                  borderLeft: '1px solid #ccc',
                  borderRight: '1px solid #ccc'
                }}>{qty}</div>
                <button onClick={() => handleQty(id, 1)} style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#f5f5f5',
                  color: '#d32f2f',
                  fontSize: 20,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}>+</button>
              </div>

              {/* Total per item */}
              <div style={{
                width: 120,
                textAlign: 'right',
                fontWeight: 600,
                marginLeft: 24
              }}>
                {(price * qty).toLocaleString()} đ
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '2px solid #222',
        padding: '16px 0',
        marginTop: 16
      }}>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          style={{ marginRight: 8, marginLeft: 4 }}
        />
        <span style={{ marginRight: 24 }}>Chọn tất cả</span>

        <span style={{ flex: 1, fontWeight: 600 }}>
          Tổng cộng ({totalItems} sản phẩm): <span style={{ color: '#8d6748' }}>{totalPrice.toLocaleString()} đ</span>
        </span>

        <button style={{
          padding: '8px 24px',
          border: '2px solid #222',
          background: '#e5c49b',
          fontWeight: 500,
          cursor: 'pointer',
          borderRadius: 6,
          color: '#111',
          fontSize: 16,
          marginRight: 8
        }}>
          Mua hàng
        </button>

        <button onClick={handleRemove} style={{
          padding: '8px 24px',
          border: '2px solid #d32f2f',
          background: '#fff',
          fontWeight: 500,
          cursor: 'pointer',
          borderRadius: 6,
          color: '#d32f2f',
          fontSize: 16
        }}>
          Xóa
        </button>
      </div>
    </div>
  );
}
