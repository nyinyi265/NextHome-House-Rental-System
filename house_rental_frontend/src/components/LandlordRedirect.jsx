import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Redirects authenticated landlords to the landlord dashboard.
 * If the user is a tenant, it renders the children (tenant home page).
 * If not authenticated, also renders children (public home page).
 */
export default function LandlordRedirect({ children }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authenticated and user is a landlord, redirect to /landlord
  if (token && user) {
    const userRole = user.role || (user.roles && user.roles.length > 0 ? user.roles[0].name : null);
    if (userRole === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    // Tenant stays on home page
    return children;
  }

  // Not authenticated - show public home page
  return children;
}
