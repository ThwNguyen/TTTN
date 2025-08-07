import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../contexts/cart.context.jsx';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
  const [selectAll, setSelectAll] = useState(true);
  const [checkedIds, setCheckedIds] = useState([]);

  useEffect(() => {
    fetchCart(); // Fetch cart data from backend when page loads
  }, []);

  useEffect(() => {
    setCheckedIds(cart.map(item => item.productId || item._id));
    setSelectAll(true);
  }, [cart]);

  const handleQty = (id, delta) => {
    const item = cart.find(i => (i.productId || i._id) === id);
    if (item) {
      updateQty(id, Math.max(1, item.qty + delta));
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
      setCheckedIds(cart.map(item => item.productId || item._id));
    }
    setSelectAll(!selectAll);
  };

  const handleRemove = () => {
    checkedIds.forEach(id => removeFromCart(id));
  };

  const totalItems = checkedIds.length;
  const totalPrice = cart
    .filter(item => checkedIds.includes(item.productId || item._id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: 24 }}>
      {/* Cart List */}
      <div>
        {cart.map(item => (
          <div key={item.productId || item._id} style={{
            display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0'
          }}>
            <input
              type="checkbox"
              checked={checkedIds.includes(item.productId || item._id)}
              onChange={() => handleCheck(item.productId || item._id)}
              style={{ marginRight: 12 }}
            />
            <div style={{
              width: 64, height: 64, background: '#fff', border: '2px solid #888',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16
            }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 32 }}>✕</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: '#8d6748', marginTop: 4 }}>Giá: {item.price?.toLocaleString()} đ</div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', margin: '0 24px'
            }}>
              <button onClick={() => handleQty(item.productId || item._id, -1)} style={{
                width: 32, height: 32, border: 'none', background: '#f5f5f5', color: '#d32f2f', fontSize: 18, fontWeight: 700, borderRadius: 6, cursor: 'pointer'
              }}>-</button>
              <div style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#d32f2f', background: '#fff'
              }}>{item.qty}</div>
              <button onClick={() => handleQty(item.productId || item._id, 1)} style={{
                width: 32, height: 32, border: 'none', background: '#f5f5f5', color: '#d32f2f', fontSize: 18, fontWeight: 700, borderRadius: 6, cursor: 'pointer'
              }}>+</button>
            </div>
            <div style={{ width: 120, textAlign: 'right', fontWeight: 600 }}>
              {(item.price * item.qty).toLocaleString()} đ
            </div>
          </div>
        ))}
      </div>
      {/* Cart Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', borderTop: '2px solid #222', padding: '16px 0', marginTop: 16
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
          padding: '8px 24px', border: '2px solid #222', background: '#e5c49b', fontWeight: 500, cursor: 'pointer', borderRadius: 6, color: '#111', fontSize: 16, marginRight: 8
        }}>Mua hàng</button>
        <button onClick={handleRemove} style={{
          padding: '8px 24px', border: '2px solid #222', background: '#fff', fontWeight: 500, cursor: 'pointer', borderRadius: 6, color: '#d32f2f', fontSize: 16
        }}>Xóa</button>
      </div>
    </div>
  );
}