import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box, Typography } from '@mui/material';

const drawerWidth = 240;

export default function Sidebar({ onSectionChange }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Dashboard
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {['Home', 'Users', 'Hairdressers', 'Appointments', 'Settings'].map((text) => (
            <ListItem button key={text} onClick={() => onSectionChange(text)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
