// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

const ProtectedRoute = ({ element, requiredRole }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to dashboard if authenticated but doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role (if specified)
  return element;
};

export default ProtectedRoute;