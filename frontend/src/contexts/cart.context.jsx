import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Fetch cart from backend on mount or when user changes
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch('http://localhost:5000/api/cart', { credentials: 'include' });
        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        setCart([]);
      }
    }
    fetchCart();
  }, []);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cart', { credentials: 'include' });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      setCart([]);
    }
  };

  // Add product to cart (sync with backend)
  const addToCart = async (product, qty = 1) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.id, qty }),
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {}
  };

  // Remove product from cart (sync with backend)
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {}
  };

  // Update quantity (sync with backend)
  const updateQty = async (productId, qty) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, qty }),
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {}
  };

  // Clear cart (sync with backend)
  const clearCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
      });
      setCart([]);
    } catch (err) {}
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}