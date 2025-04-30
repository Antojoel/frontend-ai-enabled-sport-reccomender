import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../utils/auth';

function AppNavbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '20px 40px'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '24px', 
            color: '#3b82f6',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          AI Sports Recommender
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentUser && (
            <>
              {/* Show different navigation based on role */}
              {currentUser.role.toLowerCase() === 'administrator' && (
                <Button 
                  sx={{ color: '#3b82f6', fontWeight: 'bold', mr: 2 }} 
                  onClick={() => navigate('/adminDashboard')}
                >
                  Admin Dashboard
                </Button>
              )}
              
              {currentUser.role.toLowerCase() === 'staff' && (
                <Button 
                  sx={{ color: '#3b82f6', fontWeight: 'bold', mr: 2 }} 
                  onClick={() => navigate('/staffDashboard')}
                >
                  Staff Dashboard
                </Button>
              )}
              
              {/* Regular dashboard for all users */}
              <Button 
                sx={{ color: '#3b82f6', fontWeight: 'bold', mr: 2 }} 
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              
              {/* User info and logout */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#3b82f6',
                    marginRight: '10px'
                  }}
                >
                  {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {currentUser.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    {currentUser.role}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined"
                  sx={{ 
                    color: '#f43f5e', 
                    borderColor: '#f43f5e',
                    '&:hover': {
                      borderColor: '#e11d48',
                      backgroundColor: 'rgba(244, 63, 94, 0.04)'
                    }
                  }} 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
          
          {!currentUser && (
            <>
              <Button 
                sx={{ color: '#3b82f6', fontWeight: 'bold', mr: 2 }} 
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
              <Button 
                sx={{ color: '#3b82f6', fontWeight: 'bold' }} 
                onClick={() => navigate('/signin')}
              >
                Sign In
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppNavbar;       