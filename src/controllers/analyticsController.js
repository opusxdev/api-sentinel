const analyticsService = require('../services/analyticsService');

// @desc    Get endpoint health checks
// @route   GET /api/analytics/endpoint/:id/checks
// @access  Private
exports.getEndpointChecks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 100, timeRange = '24h' } = req.query;

    const checks = await analyticsService.getHealthChecks(id, timeRange, parseInt(limit));

    res.status(200).json({
      success: true,
      count: checks.length,
      data: checks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get endpoint statistics
// @route   GET /api/analytics/endpoint/:id/stats
// @access  Private
exports.getEndpointStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timeRange = '24h' } = req.query;

    const stats = await analyticsService.calculateStats(id, timeRange);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const dashboard = await analyticsService.getDashboardStats(req.user.id);

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};