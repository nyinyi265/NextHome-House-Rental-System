import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HouseDetail from '../pages/HouseDetail';
import LandlordDashboard from '../pages/LandlordDashboard';
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
        path="/landlord" 
        element={
          <ProtectedRoute requiredRole="landlord">
            <LandlordDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
