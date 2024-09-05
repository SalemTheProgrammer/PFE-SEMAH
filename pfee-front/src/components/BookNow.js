import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the path if necessary

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

  const handleBookNow = (hairdresser) => {
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
    <div className="book-now p-8">
      <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
      <ul className="hairdresser-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hairdressers.map(hairdresser => (
          <li key={hairdresser._id} className="hairdresser-card bg-white p-6 rounded-lg shadow-md">
            <div className="hairdresser-details">
              <h3 className="text-xl font-semibold mb-2">{hairdresser.hairdresserName}</h3>
              <p className="mb-4">{hairdresser.profileDescription}</p> {/* Updated field */}
              <button 
                className="bg-[#c77210] text-white py-2 px-4 rounded hover:bg-[#b65d0a] transition-colors"
                onClick={() => handleBookNow(hairdresser)}
              >
                Book Now
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedHairdresser && (
        <div className="availability bg-white p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Availability for {selectedHairdresser.hairdresserName}
          </h3>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium mb-1">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hour" className="block text-sm font-medium mb-1">Select Hour:</label>
            <select
              id="hour"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select an hour</option>
              {Array.from({ length: 12 }, (_, i) => i + 10).map(hour => (
                <option key={hour} value={hour.toString().padStart(2, '0')}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="minute" className="block text-sm font-medium mb-1">Select Minute:</label>
            <select
              id="minute"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select minutes</option>
              <option value="00">00</option>
              <option value="30">30</option>
            </select>
          </div>
          <button 
            onClick={handleAppointment} 
            disabled={!selectedDate || !selectedHour || !selectedMinute}
            className="bg-[#c77210] text-white py-2 px-4 rounded hover:bg-[#b65d0a] transition-colors mr-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Book Appointment
          </button>
          <button 
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            onClick={() => setSelectedHairdresser(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BookNow;
