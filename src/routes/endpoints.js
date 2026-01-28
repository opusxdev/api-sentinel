const express = require('express');
const router = express.Router();
const {
  getEndpoints,
  getEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  toggleEndpoint
} = require('../controllers/endpointController');
const { protect } = require('../middleware/auth');
const { validateEndpoint } = require('../middleware/validation');

router.route('/')
  .get(protect, getEndpoints)
  .post(protect, validateEndpoint, createEndpoint);

router.route('/:id')
  .get(protect, getEndpoint)
  .put(protect, validateEndpoint, updateEndpoint)
  .delete(protect, deleteEndpoint);

router.put('/:id/toggle', protect, toggleEndpoint);

module.exports = router;
