const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  leaveRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passNumber: { type: String, required: true, unique: true },
  qrCode: { type: String },
  status: { type: String, enum: ['active', 'exited', 'returned', 'expired'], default: 'active' },
  exitTime: { type: Date },
  returnTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('GatePass', gatePassSchema);