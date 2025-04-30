import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tabs, Tab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AppNavbar from './AppNavbar';
import { getCurrentUser } from '../utils/auth';
import axios from 'axios';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Fetch blogs and users
    fetchBlogs();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // This endpoint would need to be implemented in your backend
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Don't show error for users as it might not be implemented yet
      setLoading(false);
    }
  };

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm({ ...blogForm, [name]: value });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing blog
        await axios.put(`http://localhost:5000/api/posts/${currentBlogId}`, blogForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Reset form and state
        setIsEditing(false);
        setCurrentBlogId(null);
      } else {
        // Create new blog
        await axios.post('http://localhost:5000/api/posts', blogForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      // Clear the form
      setBlogForm({
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

  const handleBlogEdit = (blog) => {
    setBlogForm({
      title: blog.title,
      content: blog.content,
      category: blog.category,
    });
    setIsEditing(true);
    setCurrentBlogId(blog.id);
  };

  const handleBlogDelete = async (id) => {
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
    setBlogForm({
      title: '',
      content: '',
      category: '',
    });
    setIsEditing(false);
    setCurrentBlogId(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Admin Dashboard - {user?.username || 'Administrator'}
          </Typography>
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
              <Tab label="Manage Blogs" />
              <Tab label="Manage Users" />
              <Tab label="System Settings" />
            </Tabs>
          </Box>
          
          {/* Blog Management Tab */}
          {tabValue === 0 && (
            <Grid container spacing={4}>
              {/* Blog Creation/Edit Form */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3 }}>
                    {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </Typography>
                  <form onSubmit={handleBlogSubmit}>
                    <TextField
                      label="Title"
                      name="title"
                      value={blogForm.title}
                      onChange={handleBlogFormChange}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Content"
                      name="content"
                      value={blogForm.content}
                      onChange={handleBlogFormChange}
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
                        value={blogForm.category}
                        onChange={handleBlogFormChange}
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
                    All Blog Posts
                  </Typography>
                  {loading ? (
                    <Typography>Loading blogs...</Typography>
                  ) : blogs.length === 0 ? (
                    <Typography>No blogs found.</Typography>
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
                                <IconButton onClick={() => handleBlogEdit(blog)} color="primary">
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleBlogDelete(blog.id)} color="error">
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
          )}
          
          {/* User Management Tab */}
          {tabValue === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3 }}>
                    Manage Users
                  </Typography>
                  {loading ? (
                    <Typography>Loading users...</Typography>
                  ) : users.length === 0 ? (
                    <Typography>No users found or user management not implemented yet.</Typography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell align="right">
                                <IconButton color="primary">
                                  <PersonIcon />
                                </IconButton>
                                <IconButton color="error">
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
          )}
          
          {/* System Settings Tab */}
          {tabValue === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3 }}>
                    System Settings
                  </Typography>
                  <Typography>
                    This is a placeholder for system settings. You can implement settings like:
                  </Typography>
                  <ul>
                    <li>Site configuration</li>
                    <li>Email notifications</li>
                    <li>Security settings</li>
                    <li>API integrations</li>
                  </ul>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}

export default AdminDashboard;