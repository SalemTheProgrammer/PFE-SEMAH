// models/hairdresser.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    date: Date,
    time: String,
    approved: { type: Boolean, default: false }
});

const HairdresserSchema = new mongoose.Schema({
    hairdresserName: String,
    hairdresserEmail: { type: String, unique: true },
    hairdresserPassword: String,
    profileDescription: String, // Updated field name
    appointments: [AppointmentSchema]
});

module.exports = mongoose.model('Hairdresser', HairdresserSchema);
