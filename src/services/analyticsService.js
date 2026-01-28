const HealthCheck = require('../models/HealthCheck');
const Endpoint = require('../models/Endpoint');
const { PERFORMANCE_THRESHOLDS } = require('../config/constants');

class AnalyticsService {
  getTimeRangeMilliseconds(timeRange) {
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '14d': 14 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return ranges[timeRange] || ranges['24h'];
  }

  async getHealthChecks(endpointId, timeRange = '24h', limit = 100) {
    const timeLimit = this.getTimeRangeMilliseconds(timeRange);
    const startDate = new Date(Date.now() - timeLimit);

    const checks = await HealthCheck.find({
      endpoint: endpointId,
      checkedAt: { $gte: startDate }
    })
    .sort('-checkedAt')
    .limit(limit)
    .lean();

    return checks;
  }

  async calculateStats(endpointId, timeRange = '24h') {
    const timeLimit = this.getTimeRangeMilliseconds(timeRange);
    const startDate = new Date(Date.now() - timeLimit);

    const checks = await HealthCheck.find({
      endpoint: endpointId,
      checkedAt: { $gte: startDate }
    }).lean();

    if (checks.length === 0) {
      return {
        uptime: 0,
        avgResponseTime: 0,
        totalChecks: 0,
        successfulChecks: 0,
        failedChecks: 0,
        performance: 'unknown',
        incidents: []
      };
    }

    const successfulChecks = checks.filter(c => c.status === 'success');
    const failedChecks = checks.filter(c => c.status !== 'success');
    
    const avgResponseTime = successfulChecks.length > 0
      ? successfulChecks.reduce((sum, c) => sum + c.responseTime, 0) / successfulChecks.length
      : 0;

    const uptime = (successfulChecks.length / checks.length) * 100;

    // Calculate performance rating
    let performance = 'excellent';
    if (avgResponseTime > PERFORMANCE_THRESHOLDS.CRITICAL) performance = 'critical';
    else if (avgResponseTime > PERFORMANCE_THRESHOLDS.POOR) performance = 'poor';
    else if (avgResponseTime > PERFORMANCE_THRESHOLDS.FAIR) performance = 'fair';
    else if (avgResponseTime > PERFORMANCE_THRESHOLDS.GOOD) performance = 'good';

    // Find incidents (consecutive failures)
    const incidents = this.findIncidents(checks);

    // Response time distribution
    const distribution = {
      fast: successfulChecks.filter(c => c.responseTime < 200).length,
      normal: successfulChecks.filter(c => c.responseTime >= 200 && c.responseTime < 500).length,
      slow: successfulChecks.filter(c => c.responseTime >= 500 && c.responseTime < 1000).length,
      verySlow: successfulChecks.filter(c => c.responseTime >= 1000).length
    };

    return {
      uptime: parseFloat(uptime.toFixed(2)),
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime: Math.min(...successfulChecks.map(c => c.responseTime)),
      maxResponseTime: Math.max(...successfulChecks.map(c => c.responseTime)),
      totalChecks: checks.length,
      successfulChecks: successfulChecks.length,
      failedChecks: failedChecks.length,
      performance,
      distribution,
      incidents: incidents.slice(0, 10), // Last 10 incidents
      timeRange
    };
  }

  findIncidents(checks) {
    const incidents = [];
    let currentIncident = null;

    // Sort by time ascending
    const sortedChecks = [...checks].sort((a, b) => a.checkedAt - b.checkedAt);

    sortedChecks.forEach((check, index) => {
      if (check.status !== 'success') {
        if (!currentIncident) {
          currentIncident = {
            startTime: check.checkedAt,
            endTime: check.checkedAt,
            duration: 0,
            failedChecks: 1,
            errorType: check.status
          };
        } else {
          currentIncident.endTime = check.checkedAt;
          currentIncident.failedChecks++;
        }
      } else if (currentIncident) {
        currentIncident.duration = currentIncident.endTime - currentIncident.startTime;
        incidents.push(currentIncident);
        currentIncident = null;
      }
    });

    // Close any open incident
    if (currentIncident) {
      currentIncident.duration = currentIncident.endTime - currentIncident.startTime;
      incidents.push(currentIncident);
    }

    return incidents.reverse(); // Most recent first
  }

  async getDashboardStats(userId) {
    const endpoints = await Endpoint.find({ user: userId, isActive: true }).lean();

    const totalEndpoints = endpoints.length;
    const upEndpoints = endpoints.filter(e => e.status === 'up').length;
    const downEndpoints = endpoints.filter(e => e.status === 'down').length;
    const degradedEndpoints = endpoints.filter(e => e.status === 'degraded').length;

    const avgResponseTime = endpoints.length > 0
      ? endpoints.reduce((sum, e) => sum + (e.lastResponseTime || 0), 0) / endpoints.length
      : 0;

    // Get overall uptime for last 24h
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentChecks = await HealthCheck.aggregate([
      {
        $match: {
          endpoint: { $in: endpoints.map(e => e._id) },
          checkedAt: { $gte: last24h }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          }
        }
      }
    ]);

    const overallUptime = recentChecks.length > 0
      ? (recentChecks[0].successful / recentChecks[0].total) * 100
      : 0;

    // Get recent incidents across all endpoints
    const recentIncidents = await HealthCheck.find({
      endpoint: { $in: endpoints.map(e => e._id) },
      status: { $ne: 'success' },
      checkedAt: { $gte: last24h }
    })
    .sort('-checkedAt')
    .limit(10)
    .populate('endpoint', 'name url')
    .lean();

    return {
      summary: {
        totalEndpoints,
        upEndpoints,
        downEndpoints,
        degradedEndpoints,
        avgResponseTime: Math.round(avgResponseTime),
        overallUptime: parseFloat(overallUptime.toFixed(2))
      },
      endpoints: endpoints.map(e => ({
        id: e._id,
        name: e.name,
        url: e.url,
        status: e.status,
        lastResponseTime: e.lastResponseTime,
        lastChecked: e.lastChecked
      })),
      recentIncidents
    };
  }

  async getHistoricalTrend(endpointId, timeRange = '7d', interval = '1h') {
    const timeLimit = this.getTimeRangeMilliseconds(timeRange);
    const startDate = new Date(Date.now() - timeLimit);

    const intervalMs = this.getTimeRangeMilliseconds(interval);

    const checks = await HealthCheck.find({
      endpoint: endpointId,
      checkedAt: { $gte: startDate }
    })
    .sort('checkedAt')
    .lean();

    // Group by interval
    const grouped = {};
    checks.forEach(check => {
      const bucket = Math.floor(check.checkedAt.getTime() / intervalMs) * intervalMs;
      if (!grouped[bucket]) {
        grouped[bucket] = {
          timestamp: new Date(bucket),
          checks: [],
          avgResponseTime: 0,
          uptime: 0
        };
      }
      grouped[bucket].checks.push(check);
    });

    // Calculate stats for each bucket
    const trend = Object.values(grouped).map(bucket => {
      const successful = bucket.checks.filter(c => c.status === 'success');
      const avgResponseTime = successful.length > 0
        ? successful.reduce((sum, c) => sum + c.responseTime, 0) / successful.length
        : 0;
      const uptime = (successful.length / bucket.checks.length) * 100;

      return {
        timestamp: bucket.timestamp,
        avgResponseTime: Math.round(avgResponseTime),
        uptime: parseFloat(uptime.toFixed(2)),
        totalChecks: bucket.checks.length
      };
    });

    return trend;
  }
}

module.exports = new AnalyticsService();