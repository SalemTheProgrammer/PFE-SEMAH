import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Checkbox, FormControlLabel
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', isAdmin: false 
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = (user = {
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', isAdmin: false 
  }) => {
    setCurrentUser(user);
    setEditMode(!!user._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({
      firstName: '', lastName: '', email: '', password: '', confirmPassword: '', isAdmin: false 
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (currentUser.password !== currentUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `http://localhost:3000/users/${currentUser._id}` : 'http://localhost:3000/register';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });

      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Edit the user details below.' : 'Enter the details of the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={currentUser.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={currentUser.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={currentUser.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={currentUser.password}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            value={currentUser.confirmPassword}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isAdmin"
                checked={currentUser.isAdmin}
                onChange={handleChange}
              />
            }
            label="Admin"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">{editMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
