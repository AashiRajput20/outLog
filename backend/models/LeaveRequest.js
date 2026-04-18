const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['home', 'general', 'emergency', 'special'], required: true },
  reason: { type: String, required: true },
  destination: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  parentContact: { type: String, required: true },
  groupMembers: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'forwarded'], default: 'pending' },
  wardenRemark: { type: String },
  adminRemark: { type: String },
  forwardedToAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);