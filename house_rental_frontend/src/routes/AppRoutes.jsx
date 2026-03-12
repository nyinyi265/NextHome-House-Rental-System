import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Explore from '../pages/Explore';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HouseDetail from '../pages/HouseDetail';
import LandlordDashboard from '../pages/LandlordDashboard';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import MyRentals from '../pages/MyRentals';
import ProtectedRoute from '../components/ProtectedRoute';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function PublicOnlyRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If already logged in, redirect to home
  if (token && user) {
    const userRole = user.role || (user.roles && user.roles.length > 0 ? user.roles[0].name : null);
    if (userRole === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        } 
      />
      <Route 
        path="/houses/:id" 
        element={
          <ProtectedRoute>
            <HouseDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        } 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Public profile route for password change from login */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/landlord" 
        element={
          <ProtectedRoute requiredRole="landlord">
            <LandlordDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/landlord/profile" 
        element={
          <ProtectedRoute requiredRole="landlord">
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tenant/profile" 
        element={
          <ProtectedRoute requiredRole="tenant">
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-rentals" 
        element={
          <ProtectedRoute requiredRole="tenant">
            <MyRentals />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
