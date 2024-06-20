import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, CssBaseline, Drawer, List, ListItem, ListItemText, Typography, Box, Container, IconButton, Badge, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { Notifications, Logout, Home, AccountCircle } from '@mui/icons-material';
import Elections from './Elections';
import Candidates from './Candidates';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState('elections');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const renderPage = () => {
    switch (selectedPage) {
      case 'elections':
        return <Elections />;
      case 'candidates':
        return <Candidates />;
      default:
        return <Elections />;
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenu}
          >
            <Avatar alt="User Avatar" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
              <AccountCircle sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => setSelectedPage('elections')}>
              <Home sx={{ mr: 1 }} />
              <ListItemText primary="Elections" />
            </ListItem>
            <ListItem button onClick={() => setSelectedPage('candidates')}>
              <Home sx={{ mr: 1 }} />
              <ListItemText primary="Candidates" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container>
          {renderPage()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
