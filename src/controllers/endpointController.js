const Endpoint = require('../models/Endpoint');
const HealthCheck = require('../models/HealthCheck');
const logger = require('../utils/logger');

// @desc    Get all endpoints for user
// @route   GET /api/endpoints
// @access  Private
exports.getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await Endpoint.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: endpoints.length,
      data: endpoints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single endpoint
// @route   GET /api/endpoints/:id
// @access  Private
exports.getEndpoint = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }

    // Make sure user owns endpoint
    if (endpoint.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new endpoint
// @route   POST /api/endpoints
// @access  Private
exports.createEndpoint = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const endpoint = await Endpoint.create(req.body);

    logger.info(`New endpoint created: ${endpoint.name} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update endpoint
// @route   PUT /api/endpoints/:id
// @access  Private
exports.updateEndpoint = async (req, res, next) => {
  try {
    let endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }

    // Make sure user owns endpoint
    if (endpoint.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    endpoint = await Endpoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete endpoint
// @route   DELETE /api/endpoints/:id
// @access  Private
exports.deleteEndpoint = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }

    // Make sure user owns endpoint
    if (endpoint.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await endpoint.deleteOne();

    // Delete associated health checks
    await HealthCheck.deleteMany({ endpoint: req.params.id });

    logger.info(`Endpoint deleted: ${endpoint.name}`);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle endpoint active status
// @route   PUT /api/endpoints/:id/toggle
// @access  Private
exports.toggleEndpoint = async (req, res, next) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }

    if (endpoint.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    endpoint.isActive = !endpoint.isActive;
    await endpoint.save();

    res.status(200).json({
      success: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
};