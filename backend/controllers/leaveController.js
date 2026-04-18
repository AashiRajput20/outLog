const LeaveRequest = require('../models/LeaveRequest');
const GatePass = require('../models/GatePass');
const qrcode = require('qrcode');

const generatePassNumber = () => {
  return 'PASS-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

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
    });

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'warden') {
      filter.forwardedToAdmin = false;
    }
    if (req.user.role === 'admin') {
      filter.$or = [{ leaveType: 'special' }, { forwardedToAdmin: true }];
    }
    const leaves = await LeaveRequest.find(filter)
      .populate('student', 'name rollNumber roomNumber hostel')
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark, forwardToAdmin } = req.body;

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (forwardToAdmin) {
      leave.forwardedToAdmin = true;
      leave.status = 'forwarded';
      leave.wardenRemark = remark || '';
      await leave.save();
      return res.status(200).json({ message: 'Forwarded to admin', leave });
    }

    leave.status = status;
    if (req.user.role === 'warden') leave.wardenRemark = remark || '';
    if (req.user.role === 'admin') leave.adminRemark = remark || '';

    await leave.save();

    if (status === 'approved') {
      const passNumber = generatePassNumber();
      const qrData = JSON.stringify({ passNumber, studentId: leave.student, leaveId: leave._id });
      const qrCode = await qrcode.toDataURL(qrData);

      await GatePass.create({
        leaveRequest: leave._id,
        student: leave.student,
        passNumber,
        qrCode,
      });
    }

    res.status(200).json({ message: `Leave ${status}`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, getMyGatePass };