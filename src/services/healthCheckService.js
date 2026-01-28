const axios = require('axios');
const Endpoint = require('../models/Endpoint');
const HealthCheck = require('../models/HealthCheck');
const notificationService = require('./notificationService');
const logger = require('../utils/logger');

class HealthCheckService {
  async checkEndpoint(endpoint) {
    const startTime = Date.now();
    let checkResult = {
      endpoint: endpoint._id,
      status: 'success',
      statusCode: null,
      responseTime: 0,
      responseSize: 0,
      errorMessage: null,
      checkedAt: new Date()
    };

    try {
      const config = {
        method: endpoint.method,
        url: endpoint.url,
        timeout: process.env.REQUEST_TIMEOUT || 30000,
        validateStatus: () => true, // Don't throw on any status code
        headers: endpoint.headers ? Object.fromEntries(endpoint.headers) : {}
      };

      if (endpoint.body && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
        config.data = endpoint.body;
      }

      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      checkResult.statusCode = response.status;
      checkResult.responseTime = responseTime;
      checkResult.responseSize = JSON.stringify(response.data).length;

      // Determine if check was successful
      if (response.status >= 200 && response.status < 400) {
        checkResult.status = 'success';
        await this.updateEndpointStatus(endpoint, 'up', responseTime, response.status);
      } else {
        checkResult.status = 'failure';
        checkResult.errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        await this.updateEndpointStatus(endpoint, 'down', responseTime, response.status);
        await this.handleFailure(endpoint, checkResult);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.code === 'ECONNABORTED') {
        checkResult.status = 'timeout';
        checkResult.errorMessage = 'Request timeout';
      } else {
        checkResult.status = 'error';
        checkResult.errorMessage = error.message;
      }
      
      checkResult.responseTime = responseTime;
      
      await this.updateEndpointStatus(endpoint, 'down', responseTime, null);
      await this.handleFailure(endpoint, checkResult);
      
      logger.error(`Health check failed for ${endpoint.url}: ${error.message}`);
    }

    // Save health check record
    await HealthCheck.create(checkResult);
    
    return checkResult;
  }

  async updateEndpointStatus(endpoint, status, responseTime, statusCode) {
    endpoint.status = status;
    endpoint.lastChecked = new Date();
    endpoint.lastResponseTime = responseTime;
    endpoint.lastStatusCode = statusCode;
    await endpoint.save();
  }

  async handleFailure(endpoint, checkResult) {
    // Check if this is a new failure (status changed from up to down)
    const recentChecks = await HealthCheck.find({
      endpoint: endpoint._id
    }).sort('-checkedAt').limit(2);

    const isNewFailure = recentChecks.length === 1 || 
                        (recentChecks.length > 1 && recentChecks[1].status === 'success');

    if (isNewFailure && endpoint.notifications.enabled) {
      await notificationService.sendAlert(endpoint, checkResult);
    }
  }

  async checkAllActiveEndpoints() {
    try {
      const now = new Date();
      const endpoints = await Endpoint.find({ isActive: true });

      const checksToRun = endpoints.filter(endpoint => {
        if (!endpoint.lastChecked) return true;
        
        const minutesSinceLastCheck = (now - endpoint.lastChecked) / 60000;
        return minutesSinceLastCheck >= endpoint.checkInterval;
      });

      logger.info(`Running health checks for ${checksToRun.length} endpoints`);

      const results = await Promise.allSettled(
        checksToRun.map(endpoint => this.checkEndpoint(endpoint))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`Health check batch completed: ${successful} successful, ${failed} failed`);

      return { successful, failed, total: checksToRun.length };
    } catch (error) {
      logger.error(`Error in checkAllActiveEndpoints: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new HealthCheckService();