import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, TextField, Paper, InputAdornment, IconButton, Divider, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AppNavbar from './AppNavbar';
import { getCurrentUser } from '../utils/auth';
import axios from 'axios';

function GuestDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [sportsEvents, setSportsEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Fetch blogs
    fetchBlogs();
    
    // Sample sports events data
    setSportsEvents([
      {
        id: 1,
        title: 'Basketball Championship',
        description: 'Join the annual basketball championship tournament.',
        date: 'May 15, 2025',
        location: 'City Sports Arena'
      },
      {
        id: 2,
        title: 'Soccer League',
        description: 'Weekly soccer matches for all skill levels.',
        date: 'Every Saturday',
        location: 'Community Field'
      },
      {
        id: 3,
        title: 'Tennis Tournament',
        description: 'Singles and doubles tennis tournament.',
        date: 'June 5, 2025',
        location: 'Tennis Club'
      }
    ]);
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

  return (
    <>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Welcome, {user?.username || 'Member'}!
          </Typography>
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          {/* Search Box */}
          <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center' }}>
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
          
          <Grid container spacing={4}>
            {/* Blogs Section */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Latest Blog Posts
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {loading ? (
                <Typography>Loading blogs...</Typography>
              ) : blogs.length === 0 ? (
                <Typography>No blogs found.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {blogs.map((blog) => (
                    <Grid item xs={12} md={6} lg={4} key={blog.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
            </Grid>
            
            {/* Sports Events Section */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recommended Sports Events
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                {sportsEvents.map((event) => (
                  <Grid item xs={12} md={4} key={event.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Date: {event.date}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Location: {event.location}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">View Details</Button>
                        <Button size="small" color="primary">Register</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default GuestDashboard;  