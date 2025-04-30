import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppNavbar from './AppNavbar';
import { getCurrentUser } from '../utils/auth';
import axios from 'axios';

function StaffDashboard() {
  const [user, setUser] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Fetch blogs
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing blog
        await axios.put(`http://localhost:5000/api/posts/${currentBlogId}`, eventForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Reset form and state
        setIsEditing(false);
        setCurrentBlogId(null);
      } else {
        // Create new blog
        await axios.post('http://localhost:5000/api/posts', eventForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      // Clear the form
      setEventForm({
        title: '',
        content: '',
        category: '',
      });
      
      // Refresh blog list
      fetchBlogs();
      setLoading(false);
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog. Please try again.');
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEventForm({
      title: blog.title,
      content: blog.content,
      category: blog.category,
    });
    setIsEditing(true);
    setCurrentBlogId(blog.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Refresh blog list
        fetchBlogs();
        setLoading(false);
      } catch (err) {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEventForm({
      title: '',
      content: '',
      category: '',
    });
    setIsEditing(false);
    setCurrentBlogId(null);
  };

  return (
    <>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Staff Dashboard - {user?.username || 'Staff'}
          </Typography>
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Grid container spacing={4}>
            {/* Blog Creation/Edit Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Content"
                    name="content"
                    value={eventForm.content}
                    onChange={handleFormChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={eventForm.category}
                      onChange={handleFormChange}
                      required
                    >
                      <MenuItem value="sports">Sports</MenuItem>
                      <MenuItem value="events">Events</MenuItem>
                      <MenuItem value="news">News</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {isEditing ? 'Update Blog' : 'Create Blog'}
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </form>
              </Card>
            </Grid>
            
            {/* Blog List */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Your Blog Posts
                </Typography>
                {loading ? (
                  <Typography>Loading blogs...</Typography>
                ) : blogs.length === 0 ? (
                  <Typography>No blogs found. Create your first blog post!</Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {blogs.map((blog) => (
                          <TableRow key={blog.id}>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.category}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={() => handleEdit(blog)} color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(blog.id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default StaffDashboard;