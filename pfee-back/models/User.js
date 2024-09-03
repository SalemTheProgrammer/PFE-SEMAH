const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique ids

const UserSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Generate a UUID if _id is not specified
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
