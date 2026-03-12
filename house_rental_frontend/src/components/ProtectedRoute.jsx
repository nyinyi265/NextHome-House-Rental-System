import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Higher-order component that protects routes based on user role
 * 
 * @param {React.ReactNode} children - The component to render
 * @param {string} requiredRole - The role required to access this route ('landlord' | 'tenant' | null for any authenticated user)
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  // If still loading auth state from localStorage, don't redirect yet
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from the response
  // The role can be in user.role or user.roles[0].name
  const userRole = user.role || (user.roles && user.roles.length > 0 ? user.roles[0].name : null);

  // If a specific role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    // If landlord tries to access tenant pages, redirect to landlord dashboard
    if (requiredRole === 'tenant' && userRole === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    // If tenant tries to access landlord pages, redirect to home
    if (requiredRole === 'landlord' && userRole === 'tenant') {
      return <Navigate to="/" replace />;
    }
    // For any other case, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
