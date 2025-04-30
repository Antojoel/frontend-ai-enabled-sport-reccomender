import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import WelcomePage1 from './components/WelcomePage1';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import GuestDashboard from './components/GuestDashboard';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import BlogDetails from './components/BlogDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, setupAxiosInterceptors } from './utils/auth';

function App() {
  useEffect(() => {
    // Setup axios interceptors for authentication
    setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage1 />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<GuestDashboard />} />} 
        />
        <Route 
          path="/staffDashboard" 
          element={<ProtectedRoute element={<StaffDashboard />} requiredRole="Staff" />} 
        />
        <Route 
          path="/adminDashboard" 
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="Administrator" />} 
        />
        
        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;