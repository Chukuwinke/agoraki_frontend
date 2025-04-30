// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import KYCPage  from './components/KYCPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"   element={<HomePage />} />
        <Route path="/kyc" element={<KYCPage  />} />
        <Route path="*"   element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
