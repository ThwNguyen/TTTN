import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Lấy giỏ hàng từ backend
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        credentials: 'include',
      });
      const data = await res.json();
      setCart(data.cart || []);
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      setCart([]);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id || product.id,
          quantity,
        }),
      });
      const data = await res.json();
      setCart(data.cart?.items || []);
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ
  const updateQty = async (productId, quantity) => {
    try {
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data.cart?.items || []);
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
    }
  };

  // Xoá 1 sản phẩm khỏi giỏ
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      setCart(data.cart?.items || []);
    } catch (err) {
      console.error('Lỗi khi xoá sản phẩm khỏi giỏ:', err);
    }
  };

  // Xoá toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error('Lỗi khi xoá toàn bộ giỏ hàng:', err);
    }
  };

  // Thanh toán 1 sản phẩm
  const checkoutProduct = async (productId) => {
    try {
      const res = await fetch(`/api/cart/checkout/${productId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      setCart(data.cart?.items || []);
    } catch (err) {
      console.error('Lỗi khi thanh toán sản phẩm:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        checkoutProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
