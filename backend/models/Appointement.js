// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  hairdresserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hairdresser', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
