import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../pages/client/homepage';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ProductDetail from '../pages/client/productDetail'; // Add this import

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/product/:id" element={<ProductDetail />} /> {/* Add this line */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
