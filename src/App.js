import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import router components
import './App.css';
import WelcomePage1 from './components/WelcomePage1';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import GuestDashboard from './components/GuestDashboard';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage1 />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<GuestDashboard />} />
        <Route path="/staffDashboard" element={<StaffDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
