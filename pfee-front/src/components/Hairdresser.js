import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Checkbox, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Hairdressers = () => {
  const [hairdressers, setHairdressers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentHairdresser, setCurrentHairdresser] = useState({
    hairdresserName: '', hairdresserEmail: '', hairdresserPassword: '', profileDescription: '', appointments: []
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchHairdressers();
  }, []);

  const fetchHairdressers = async () => {
    try {
      const response = await fetch('http://localhost:3000/hairdressers');
      const data = await response.json();
      setHairdressers(data);
    } catch (error) {
      console.error('Error fetching hairdressers:', error);
    }
  };

  const handleOpen = (hairdresser = {
    hairdresserName: '', hairdresserEmail: '', hairdresserPassword: '', profileDescription: '', appointments: []
  }) => {
    setCurrentHairdresser(hairdresser);
    setConfirmPassword(''); // Reset confirm password
    setEditMode(!!hairdresser._id);
    setOpen(true);
    setPasswordError('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentHairdresser({ hairdresserName: '', hairdresserEmail: '', hairdresserPassword: '', profileDescription: '', appointments: [] });
    setPasswordError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentHairdresser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editMode && currentHairdresser.hairdresserPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `http://localhost:3000/hairdressers/${currentHairdresser._id}` : 'http://localhost:3000/register-hairdresser';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentHairdresser),
      });

      fetchHairdressers();
      handleClose();
    } catch (error) {
      console.error('Error saving hairdresser:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/hairdressers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete hairdresser');
      }

      setHairdressers(hairdressers.filter(hairdresser => hairdresser._id !== id));
    } catch (err) {
      console.error('Error deleting hairdresser:', err.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Hairdressers</Typography>
      
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hairdresser Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Profile Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hairdressers.map((hairdresser) => (
              <TableRow key={hairdresser._id}>
                <TableCell>{hairdresser.hairdresserName}</TableCell>
                <TableCell>{hairdresser.hairdresserEmail}</TableCell>
                <TableCell>{hairdresser.profileDescription}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(hairdresser)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(hairdresser._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Hairdresser' : 'Add Hairdresser'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Edit the hairdresser details below.' : 'Enter the details of the new hairdresser.'}
          </DialogContentText>
          {passwordError && <Alert severity="error">{passwordError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            name="hairdresserName"
            label="Hairdresser Name"
            type="text"
            fullWidth
            value={currentHairdresser.hairdresserName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="hairdresserEmail"
            label="Email Address"
            type="email"
            fullWidth
            value={currentHairdresser.hairdresserEmail}
            onChange={handleChange}
          />
          {!editMode && (
            <>
              <TextField
                margin="dense"
                name="hairdresserPassword"
                label="Password"
                type="password"
                fullWidth
                value={currentHairdresser.hairdresserPassword}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
          <TextField
            margin="dense"
            name="profileDescription"
            label="Profile Description"
            type="text"
            fullWidth
            value={currentHairdresser.profileDescription}
            onChange={handleChange}
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

export default Hairdressers;
