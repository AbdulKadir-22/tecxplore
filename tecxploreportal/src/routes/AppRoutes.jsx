import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EventVerification from '../pages/EventVerification';
import EventLive from '../pages/EventLive';
import ModeratorProfile from '../pages/ModeratorProfile';
import SystemAdminDashboard from '../pages/SystemAdminDashboard'; 
import AdminEventDetails from '../pages/AdminEventDetails';

// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  
  // 1. Check Authentication
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. Check Role Permission (if roles are defined)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If a non-admin tries to access admin pages, kick them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* SHARED DASHBOARD:
         - Accessible by COORDINATOR and SYSTEM_ADMIN
         - Allows Admins to perform "Coordinator Duties" (Verify/Monitor)
      */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
             <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* --- COORDINATOR FLOWS (Accessible by Admin too) --- */}
      <Route 
        path="/event/verification/:id" 
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'SYSTEM_ADMIN']}>
            <EventVerification />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/event/live/:id" 
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR', 'SYSTEM_ADMIN']}>
            <EventLive />
          </ProtectedRoute>
        } 
      />

      {/* --- MODERATOR PROFILE --- */}
      <Route 
        path="/moderator" 
        element={
          <ProtectedRoute>
            <ModeratorProfile />
          </ProtectedRoute>
        } 
      />

      {/* --- SYSTEM ADMIN CONSOLE (Restricted) --- */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <SystemAdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/event/:id" 
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <AdminEventDetails />
          </ProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;