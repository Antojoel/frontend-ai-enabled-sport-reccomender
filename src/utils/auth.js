// src/utils/auth.js
import axios from 'axios';

// Add token to all requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  }
  return null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRole = user.role.toLowerCase();
  return userRole === requiredRole.toLowerCase();
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Initialize the interceptors
setupAxiosInterceptors();