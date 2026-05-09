import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/tenant/Home';
import About from '../pages/public/About';
import ContactUs from '../pages/public/ContactUs';
import Explore from '../pages/tenant/Explore';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import LandlordRegister from '../pages/auth/LandlordRegister';
import HouseDetail from '../pages/tenant/HouseDetail';
import LandlordDashboard from '../pages/landlord/LandlordDashboard';
import LandlordRentals from '../pages/landlord/LandlordRentals';
import Profile from '../pages/tenant/Profile';
import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import MyRentals from '../pages/tenant/MyRentals';
import MyRentalApplications from '../pages/tenant/MyRentalApplications';
import Compare from '../pages/tenant/Compare';
import AdminDashboard from '../pages/admin/AdminDashboard';
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
      <Route path="/contact" element={<ContactUs />} />
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
      <Route path="/landlord-register" element={<LandlordRegister />} />
      <Route 
        path="/houses/:slug" 
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
        path="/landlord/rentals" 
        element={
          <ProtectedRoute requiredRole="landlord">
            <LandlordRentals />
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
      <Route 
        path="/my-applications" 
        element={
          <ProtectedRoute requiredRole="tenant">
            <MyRentalApplications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/compare" 
        element={
          <ProtectedRoute requiredRole="tenant">
            <Compare />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
