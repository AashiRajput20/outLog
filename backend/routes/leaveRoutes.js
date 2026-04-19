const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  wardenAction,
  adminAction,
  getMyGatePass
} = require('../controllers/leaveController');
const { protect, allowRoles } = require('../middleware/auth');

router.post('/apply', protect, allowRoles('student'), applyLeave);
router.get('/my', protect, allowRoles('student'), getMyLeaves);
router.get('/my-gatepass', protect, allowRoles('student'), getMyGatePass);
router.get('/all', protect, allowRoles('warden', 'admin'), getAllLeaves);

// Separate routes for warden and admin actions
router.put('/warden-action/:id', protect, allowRoles('warden'), wardenAction);
router.put('/admin-action/:id', protect, allowRoles('admin'), adminAction);

module.exports = router;