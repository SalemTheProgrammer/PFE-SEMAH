import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the path if necessary
import './BookNow.css';

const BookNow = ({ user }) => {
  const [hairdressers, setHairdressers] = useState([]);
  const [selectedHairdresser, setSelectedHairdresser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

  useEffect(() => {
    const fetchHairdressers = async () => {
      try {
        const response = await api.get('/hairdressers');
        setHairdressers(response.data);
      } catch (error) {
        console.error('Failed to fetch hairdressers', error);
      }
    };

    fetchHairdressers();
  }, []);

  const handleBookNow = async (hairdresser) => {
    setSelectedHairdresser(hairdresser);
    setSelectedDate(''); // Reset selected date
    setSelectedHour(''); // Reset selected hour
    setSelectedMinute(''); // Reset selected minute
  };

  const handleAppointment = async () => {
    if (!user || !user._id || !user.email) {
      console.error('User information is missing');
      alert('User information is missing. Please log in and try again.');
      return;
    }

    const appointmentDetails = {
      hairdresserId: selectedHairdresser._id,
      customerId: user._id,
      date: selectedDate,
      time: `${selectedHour}:${selectedMinute}`,
    };

    try {
      await api.post('/book-appointment', appointmentDetails);
      alert('Appointment booked successfully');
      setSelectedHairdresser(null); // Close the schedule view
      setSelectedDate('');
      setSelectedHour('');
      setSelectedMinute('');
    } catch (error) {
      console.error('Failed to book appointment', error);
    }
  };

  return (
    <div className="book-now">
      <h2>Book an Appointment</h2>
      <ul className="hairdresser-list">
        {hairdressers.map(hairdresser => (
          <li key={hairdresser._id} className="hairdresser-card">
            <div className="hairdresser-details">
              <h3>{hairdresser.hairdresserName}</h3>
              <p>{hairdresser.profileDescription}</p> {/* Updated field */}
              <button onClick={() => handleBookNow(hairdresser)}>Book Now</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedHairdresser && (
        <div className="availability">
          <h3>Availability for {selectedHairdresser.hairdresserName}</h3>
          <div>
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="hour">Select Hour:</label>
            <select
              id="hour"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
            >
              <option value="">Select an hour</option>
              {Array.from({ length: 12 }, (_, i) => i + 10).map(hour => (
                <option key={hour} value={hour.toString().padStart(2, '0')}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minute">Select Minute:</label>
            <select
              id="minute"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
            >
              <option value="">Select minutes</option>
              <option value="00">00</option>
              <option value="30">30</option>
            </select>
          </div>
          <button onClick={handleAppointment} disabled={!selectedDate || !selectedHour || !selectedMinute}>
            Book Appointment
          </button>
          <button className="close-button" onClick={() => setSelectedHairdresser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BookNow;
