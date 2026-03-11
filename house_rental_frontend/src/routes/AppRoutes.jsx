import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HouseDetail from '../pages/HouseDetail';
import LandlordDashboard from '../pages/LandlordDashboard';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/houses/:id" element={<HouseDetail />} />
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
      <Route path="/profile" element={<Profile />} />
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
    </Routes>
  );
}
