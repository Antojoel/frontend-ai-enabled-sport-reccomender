import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Chip, Button, CircularProgress, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import { getCurrentUser } from '../utils/auth';

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    fetchBlog();
  }, [id]);
  
  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blog details:', err);
      setError('Failed to load blog post. Please try again.');
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    // Redirect to appropriate dashboard for editing
    const userRole = currentUser?.role?.toLowerCase();
    if (userRole === 'administrator' || userRole === 'admin') {
      navigate(`/adminDashboard?edit=${id}`);
    } else if (userRole === 'staff') {
      navigate(`/staffDashboard?edit=${id}`);
    } else {
      navigate(`/dashboard?edit=${id}`);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLoading(false);
        navigate(-1); // Go back after deletion
      } catch (err) {
        console.error('Error deleting blog post:', err);
        setError('Failed to delete blog post. Please try again.');
        setLoading(false);
      }
    }
  };
  
  const hasEditPermission = () => {
    if (!currentUser) return false;
    
    const role = currentUser.role.toLowerCase();
    return role === 'administrator' || role === 'admin' || role === 'staff' || role === 'member';
  };
  
  return (
    <>
      <AppNavbar />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back to Blogs
        </Button>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </Paper>
        ) : blog ? (
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={blog.category} 
                color="primary" 
                variant="outlined" 
                sx={{ mb: 2 }}
              />
              {blog.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
              {blog.title}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
              {blog.content}
            </Typography>
            
            {hasEditPermission() && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleEdit}
                  sx={{ mr: 2 }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Paper>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Blog post not found.</Typography>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default BlogDetails;