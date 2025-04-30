import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, TextField, Box, Container, CssBaseline,
  FormControl, InputLabel, Select, MenuItem, Snackbar, CircularProgress, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
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

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);

      if (response.status === 200) {
        // Store user data and token
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          username: response.data.user.username,
          role: response.data.user.role
        };
        
        // Store token for possible direct login
        localStorage.setItem('token', response.data.token);
        
        // Show success message
        setSnackbar({ 
          open: true, 
          message: response.data.message || "Sign Up successful! Redirecting to Sign In page..." 
        });
        
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err) {
      // Display error message based on response
      const errorMessage = err.response?.data?.message || 'Sign Up failed. Please try again.';
      setError(errorMessage);
      console.error('Error during sign-up:', err.response ? err.response.data : err.message);
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
            <Button sx={{ color: '#3b82f6', fontWeight: 'bold' }} onClick={() => navigate('/signin')}>Sign In</Button>
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
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
                label="Username"
                name="username"
                type="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: 2 }}
              />
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link href="/signin" underline="hover">
                  Sign in
                </Link>
              </Typography>
            </form>
          </Box>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Error Message */}
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

export default SignUpPage;