import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { Box, Typography, Grid } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [hairdressers, setHairdressers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchHairdressers();
    fetchAppointments();
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

  const fetchHairdressers = async () => {
    try {
      const response = await fetch('http://localhost:3000/hairdressers');
      const data = await response.json();
      setHairdressers(data);
    } catch (error) {
      console.error('Error fetching hairdressers:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Group data for pie charts
  const userPieData = [
    { name: 'Admin', value: users.filter(user => user.isAdmin).length },
    { name: 'User', value: users.filter(user => !user.isAdmin).length },
  ];

  const hairdresserPieData = [
    { name: 'Hairdressers', value: hairdressers.length },
  ];

  const appointmentPieData = [
    { name: 'Approved', value: appointments.filter(appointment => appointment.approved).length },
    { name: 'Pending', value: appointments.filter(appointment => !appointment.approved).length },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Overview</Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" align="center">Users</Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={userPieData}
              cx={150}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {userPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" align="center">Hairdressers</Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={hairdresserPieData}
              cx={150}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {hairdresserPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" align="center">Appointments</Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={appointmentPieData}
              cx={150}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {appointmentPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
