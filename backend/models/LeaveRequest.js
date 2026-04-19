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

  // Overall status shown to student
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'forwarded_to_admin'],
    default: 'pending'
  },

  // Warden's decision
  wardenStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'forwarded'],
    default: 'pending'
  },
  wardenRemark: { type: String },

  // Admin's decision (only filled if warden forwarded)
  forwardedToAdmin: { type: Boolean, default: false },
  adminStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminRemark: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);