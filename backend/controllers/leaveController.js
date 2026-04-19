const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass');
const qrcode = require('qrcode');

const generatePassNumber = () => {
  return 'PASS-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

// STUDENT: Apply leave — goes to warden only
const applyLeave = async (req, res) => {
  try {
    const { leaveType, reason, destination, fromDate, toDate, parentContact, groupMembers } = req.body;

    const leave = await LeaveRequest.create({
      student: req.user.id,
      leaveType,
      reason,
      destination,
      fromDate,
      toDate,
      parentContact,
      groupMembers: groupMembers || [],
      status: 'pending',
      wardenStatus: 'pending',
      forwardedToAdmin: false,
    });

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: Get my leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WARDEN: Get all leaves (everything comes to warden)
// ADMIN: Get only forwarded leaves
const getAllLeaves = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'warden') {
      // Warden sees ALL leave requests
      filter = {};
    } else if (req.user.role === 'admin') {
      // Admin only sees leaves that warden forwarded
      filter = { forwardedToAdmin: true };
    }

    const leaves = await LeaveRequest.find(filter)
      .populate('student', 'name rollNumber roomNumber hostel')
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WARDEN: Approve / Reject / Forward to Admin
const wardenAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remark } = req.body;
    // action: 'approve' | 'reject' | 'forward'

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (action === 'forward') {
      leave.wardenStatus = 'forwarded';
      leave.forwardedToAdmin = true;
      leave.status = 'forwarded_to_admin';
      leave.wardenRemark = remark || '';
      await leave.save();
      return res.status(200).json({ message: 'Forwarded to admin', leave });
    }

    if (action === 'approve') {
      leave.wardenStatus = 'approved';
      leave.status = 'approved';
      leave.wardenRemark = remark || '';
      await leave.save();

      // Generate gate pass on warden approval
      const passNumber = generatePassNumber();
      const qrData = JSON.stringify({ passNumber, studentId: leave.student, leaveId: leave._id });
      const qrCode = await qrcode.toDataURL(qrData);

      await GatePass.create({
        leaveRequest: leave._id,
        student: leave.student,
        passNumber,
        qrCode,
      });

      return res.status(200).json({ message: 'Leave approved and gate pass generated', leave });
    }

    if (action === 'reject') {
      leave.wardenStatus = 'rejected';
      leave.status = 'rejected';
      leave.wardenRemark = remark || '';
      await leave.save();
      return res.status(200).json({ message: 'Leave rejected', leave });
    }

    return res.status(400).json({ message: 'Invalid action. Use approve, reject, or forward' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Approve or Reject a forwarded leave
const adminAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remark } = req.body;
    // action: 'approve' | 'reject'

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (!leave.forwardedToAdmin) {
      return res.status(403).json({ message: 'This leave was not forwarded to admin' });
    }

    if (action === 'approve') {
      leave.adminStatus = 'approved';
      leave.adminRemark = remark || '';
      // Status shows warden that admin approved — warden still needs to give final decision
      leave.status = 'pending'; // back to pending so warden can act
      await leave.save();
      return res.status(200).json({ message: 'Admin approved. Warden can now give final decision.', leave });
    }

    if (action === 'reject') {
      leave.adminStatus = 'rejected';
      leave.adminRemark = remark || '';
      leave.status = 'pending'; // back to pending so warden can still act
      await leave.save();
      return res.status(200).json({ message: 'Admin rejected. Warden can now give final decision.', leave });
    }

    return res.status(400).json({ message: 'Invalid action. Use approve or reject' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: Get my gate pass
const getMyGatePass = async (req, res) => {
  try {
    const gatePass = await GatePass.find({ student: req.user.id })
      .populate('leaveRequest')
      .sort({ createdAt: -1 });
    res.status(200).json(gatePass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, wardenAction, adminAction, getMyGatePass };