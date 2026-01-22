import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EventVerification from '../pages/EventVerification';
import EventLive from '../pages/EventLive';
import ModeratorProfile from '../pages/ModeratorProfile';

// Protected Route Wrapper (Simple implementation)
const ProtectedRoute = ({ children }) => {
  // In a real app, check auth context here
  return children; 
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* DISTINCT FLOWS */}
      <Route path="/event/verification/:id" element={<ProtectedRoute><EventVerification /></ProtectedRoute>} />
      <Route path="/event/live/:id" element={<ProtectedRoute><EventLive /></ProtectedRoute>} />
      
      <Route path="/moderator" element={<ProtectedRoute><ModeratorProfile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;