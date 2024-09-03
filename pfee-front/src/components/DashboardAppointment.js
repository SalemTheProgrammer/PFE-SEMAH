import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({
    hairdresserId: '', customerId: '', date: '', time: '', approved: false
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/appointments'); // Adjust the endpoint if necessary
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleOpen = (appointment = {
    hairdresserId: '', customerId: '', date: '', time: '', approved: false
  }) => {
    setCurrentAppointment(appointment);
    setEditMode(!!appointment._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAppointment({
      hairdresserId: '', customerId: '', date: '', time: '', approved: false
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `http://localhost:3000/appointments/${currentAppointment._id}` : 'http://localhost:3000/book-appointment';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAppointment),
      });

      fetchAppointments();
      handleClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete appointment');
      }

      setAppointments(appointments.filter(appointment => appointment._id !== id));
    } catch (err) {
      console.error('Error deleting appointment:', err.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Appointments</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Appointment
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hairdresser ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.hairdresserId}</TableCell>
                <TableCell>{appointment.customerId}</TableCell>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(appointment)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(appointment._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Appointment' : 'Add Appointment'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Edit the appointment details below.' : 'Enter the details of the new appointment.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="hairdresserId"
            label="Hairdresser ID"
            type="text"
            fullWidth
            value={currentAppointment.hairdresserId}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="customerId"
            label="Customer ID"
            type="text"
            fullWidth
            value={currentAppointment.customerId}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={currentAppointment.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="time"
            label="Time"
            type="time"
            fullWidth
            value={currentAppointment.time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="approved"
            label="Approved"
            type="checkbox"
            fullWidth
            checked={currentAppointment.approved}
            onChange={(e) => setCurrentAppointment(prev => ({ ...prev, approved: e.target.checked }))}
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

export default Appointments;
