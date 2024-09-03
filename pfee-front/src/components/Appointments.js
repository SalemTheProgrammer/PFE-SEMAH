import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the path if necessary

const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // To manage loading state during approval

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (loginResponse && loginResponse.user) {
          const userId = loginResponse.user._id;
          
          const response = await api.get(`/appointments/${userId}`);
          
          if (response.data) {
            console.log("Fetched appointments:", response.data);
            setAppointments(response.data);
          } else {
            console.error('No data returned for appointments');
          }
        } else {
          console.error('User data not found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };
  
    fetchAppointments();
  }, []);
  
  const approveAppointment = async (appointmentId) => {
    setLoading(true);
    console.log('Attempting to approve appointment with ID:', appointmentId);
    
    try {
  
      const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
      if (loginResponse && loginResponse.user) {
        const userId = loginResponse.user._id;
        
        const response = await api.post('/approve-appointment', { hairdresserId: userId, appointmentId });
        console.log('Response from server:', response);
  
        if (response.status === 200) {
          console.log('Appointment approved successfully');
          setAppointments((prevAppointments) =>
            prevAppointments.map((app) =>
              app._id === appointmentId ? { ...app, approved: true } : app
            )
          );
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } 
    } catch (error) {
      console.error('Error occurred during approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Your Appointments</h2>
      <button 
        onClick={handlePrint} 
        disabled={loading} 
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {loading ? 'Processing...' : 'Print Appointments'}
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Customer</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.customerId}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(appointment.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.time}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.approved ? 'Approved' : 'Pending'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {!appointment.approved && (
                    <button 
                      onClick={() => approveAppointment(appointment._id)} 
                      disabled={loading}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#008CBA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      {loading ? 'Processing...' : 'Approve'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No appointments available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
