import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import KYCPage from './components/KYCPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const handleJoin = e => {
    e.preventDefault();
    const email = e.target.email.value;
    alert(`Thanks! We'll notify ${email} soon.`);
    e.target.reset();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage onJoin={handleJoin} />} />
        <Route
          path="/kyc"
          element={<ProtectedRoute><KYCPage/></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
