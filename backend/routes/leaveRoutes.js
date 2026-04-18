const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, getMyGatePass } = require('../controllers/leaveController');
const { protect, allowRoles } = require('../middleware/auth');

router.post('/apply', protect, allowRoles('student'), applyLeave);
router.get('/my', protect, allowRoles('student'), getMyLeaves);
router.get('/my-gatepass', protect, allowRoles('student'), getMyGatePass);
router.get('/all', protect, allowRoles('warden', 'admin'), getAllLeaves);
router.put('/update/:id', protect, allowRoles('warden', 'admin'), updateLeaveStatus);

module.exports = router;