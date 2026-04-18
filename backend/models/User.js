const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'warden', 'admin', 'security'], required: true },
  rollNumber: { type: String },
  roomNumber: { type: String },
  hostel: { type: String },
  parentContact: { type: String },
  phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);