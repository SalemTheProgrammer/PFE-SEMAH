import React from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box, AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
const drawerWidth = 240;

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
       
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <div className="header-left">
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Overview', 'Users', 'Hairdressers', 'Appointments'].map((text, index) => (
              <ListItem button key={text} component="a" href={`/dashboard/${text.toLowerCase()}`}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet /> {/* Renders the child routes */}
      </Box>
    </Box>
  );
}
