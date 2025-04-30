import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, Divider, TextField, InputAdornment, IconButton, Chip, Paper, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

function WelcomePage1() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Fetch blogs on component mount
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setBlogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to fetch blogs. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBlogs();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/posts/search?q=${searchTerm}`);
      setBlogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching blogs:', err);
      setError('Failed to search blogs. Please try again.');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateToDashboard = () => {
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }

    // Navigate based on user role
    const role = currentUser?.role?.toLowerCase();
    if (role === 'administrator' || role === 'admin') {
      navigate('/adminDashboard');
    } else if (role === 'staff') {
      navigate('/staffDashboard');
    } else {  
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>AI Sports Recommender</h1>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                style={{ ...styles.button, backgroundColor: '#3b82f6', color: 'white', marginRight: '10px' }}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
              <button
                style={{ ...styles.button, border: '2px solid #3b82f6', color: '#3b82f6', backgroundColor: 'white' }}
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <button
                style={{ ...styles.button, backgroundColor: '#3b82f6', color: 'white', marginRight: '10px' }}
                onClick={navigateToDashboard}
              >
                Dashboard
              </button>
              <button
                style={{ ...styles.button, border: '2px solid #ef4444', color: '#ef4444', backgroundColor: 'white' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <Container maxWidth="lg">
          <h2 style={styles.title}>Discover the Best Sports Events Tailored for You</h2>
          <p style={styles.description}>
            Our AI-powered recommendation system helps you find sports events you'll love — whether you're a player,
            fan, or organizer.
          </p>
          
          {/* Search Box */}
          <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            <TextField
              fullWidth
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
          
          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 3 }}>
              {error}
            </Typography>
          )}
          
          {/* Blogs Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Latest Blog Posts
            </Typography>
            <Divider sx={{ mb: 4, maxWidth: '200px', margin: '0 auto 30px auto' }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : blogs.length === 0 ? (
              <Typography sx={{ textAlign: 'center' }}>No blogs found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {blogs.map((blog) => (
                  <Grid item xs={12} md={4} key={blog.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                            {blog.title}
                          </Typography>
                          <Chip 
                            label={blog.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {blog.content.length > 150 
                            ? `${blog.content.substring(0, 150)}...` 
                            : blog.content}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => navigate(`/blog/${blog.id}`)}
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          
          {/* Call to Action */}
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ready to get personalized sports recommendations?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => isLoggedIn ? navigateToDashboard() : navigate('/signup')}
              sx={{ 
                mt: 2, 
                fontSize: '1.1rem', 
                px: 4, 
                py: 1.5,
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Sign Up Now'}
            </Button>
          </Box>
        </Container>
      </main>
    </div>
  );
}

const styles = {
  header: {
    padding: '20px 40px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
  },
  main: {
    textAlign: 'center',
    marginTop: '60px',
    padding: '0 20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#4b5563',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
};

export default WelcomePage1;