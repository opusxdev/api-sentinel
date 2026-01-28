const express = require('express');
const router = express.Router();
const {
  getEndpointChecks,
  getEndpointStats,
  getDashboard
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.get('/endpoint/:id/checks', protect, getEndpointChecks);
router.get('/endpoint/:id/stats', protect, getEndpointStats);

module.exports = router;