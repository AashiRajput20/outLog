const GatePass = require('../models/GatePass');

const verifyPass = async (req, res) => {
  try {
    const { passNumber } = req.body;

    const gatePass = await GatePass.findOne({ passNumber })
      .populate('student', 'name rollNumber roomNumber hostel phone')
      .populate('leaveRequest');

    if (!gatePass) return res.status(404).json({ message: 'Invalid pass number' });

    res.status(200).json(gatePass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markExit = async (req, res) => {
  try {
    const { passNumber } = req.body;

    const gatePass = await GatePass.findOne({ passNumber });
    if (!gatePass) return res.status(404).json({ message: 'Invalid pass number' });

    if (gatePass.status === 'exited') return res.status(400).json({ message: 'Student already exited' });
    if (gatePass.status === 'returned') return res.status(400).json({ message: 'Student already returned' });

    gatePass.status = 'exited';
    gatePass.exitTime = new Date();
    await gatePass.save();

    res.status(200).json({ message: 'Exit marked successfully', gatePass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markReturn = async (req, res) => {
  try {
    const { passNumber } = req.body;

    const gatePass = await GatePass.findOne({ passNumber });
    if (!gatePass) return res.status(404).json({ message: 'Invalid pass number' });

    if (gatePass.status === 'returned') return res.status(400).json({ message: 'Student already returned' });
    if (gatePass.status === 'active') return res.status(400).json({ message: 'Student has not exited yet' });

    gatePass.status = 'returned';
    gatePass.returnTime = new Date();
    await gatePass.save();

    res.status(200).json({ message: 'Return marked successfully', gatePass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGatePasses = async (req, res) => {
  try {
    const gatePasses = await GatePass.find()
      .populate('student', 'name rollNumber roomNumber hostel')
      .populate('leaveRequest')
      .sort({ createdAt: -1 });

    res.status(200).json(gatePasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyPass, markExit, markReturn, getAllGatePasses };