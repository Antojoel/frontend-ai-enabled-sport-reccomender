import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, TextField, Box, Container, CssBaseline,
  FormControl, InputLabel, Select, MenuItem, Snackbar, CircularProgress, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', formData);

      if (response.status === 200) {
        // Store user data and token from response
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          username: response.data.user.username,
          role: response.data.user.role
        };
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setOpenSnackbar(true);

        setTimeout(() => {
          // Navigate based on user role
          if (userData.role.toLowerCase() === 'admin' || userData.role.toLowerCase() === 'administrator') {
            navigate('/adminDashboard');
          } else if (userData.role.toLowerCase() === 'staff') {
            navigate('/staffDashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Invalid credentials or role. Please try again.';
      setError(errorMessage);
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px 40px'}}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '24px', color: '#3b82f6' }}>
            AI Sports Recommender
          </Typography>
          <Box>
            <Button sx={{ color: '#3b82f6', fontWeight: 'bold', mr: 2 }} onClick={() => navigate('/')}>Home</Button>
            <Button sx={{ color: '#3b82f6', fontWeight: 'bold' }} onClick={() => navigate('/signup')}>Sign Up</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page Background */}
      <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', py: 6 }}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 3,
              borderRadius: 2,
              boxShadow: 4,
              backgroundColor: 'white',
            }}
          >
            <Typography variant="h4">
              Sign In
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#5C6BC0',
                  '&:hover': { backgroundColor: '#5C6BC0' },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <Link href="/signup" underline="hover">
                  Sign up
                </Link>
              </Typography>
            </form>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for Success */}
      <Snackbar
        open={openSnackbar}
        message="Sign In successful! Redirecting to Dashboard..."
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={true}
          message={error}
          autoHideDuration={3000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      )}
    </React.Fragment>
  );
}

export default SignInPage;