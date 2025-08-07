import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../pages/client/homepage';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ProductDetail from '../pages/client/productDetail'; 
import Search from '../pages/client/search';
import Cart from '../pages/client/cart'; // Add this import

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<Cart />} /> {/* Add this line for cart route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
