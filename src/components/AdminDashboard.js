import React from 'react';
import { Box, Typography } from '@mui/material';

function AdminDashboard() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Welcome to the Admin Dashboard</Typography>
      <Typography variant="body1">This is the dashboard for Admins.</Typography>
    </Box>
  );
}

export default AdminDashboard;
