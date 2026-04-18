const express = require('express');
const router = express.Router();
const { verifyPass, markExit, markReturn, getAllGatePasses } = require('../controllers/securityController');
const { protect, allowRoles } = require('../middleware/auth');

router.post('/verify', protect, allowRoles('security'), verifyPass);
router.post('/mark-exit', protect, allowRoles('security'), markExit);
router.post('/mark-return', protect, allowRoles('security'), markReturn);
router.get('/all-passes', protect, allowRoles('security', 'admin'), getAllGatePasses);

module.exports = router;