const cron = require('node-cron');
const healthCheckService = require('../services/healthCheckService');
const logger = require('../utils/logger');

let workerTask = null;

exports.startHealthCheckWorker = () => {
  if (workerTask) {
    logger.warn('Health check worker already running');
    return;
  }

  // Run health checks every minute
  workerTask = cron.schedule('* * * * *', async () => {
    try {
      logger.info('Starting health check batch...');
      const results = await healthCheckService.checkAllActiveEndpoints();
      logger.info(`Health check batch completed: ${JSON.stringify(results)}`);
    } catch (error) {
      logger.error(`Health check worker error: ${error.message}`);
    }
  });

  logger.info('✅ Health check worker started - running every minute');

  // Also run immediately on startup
  setTimeout(async () => {
    try {
      await healthCheckService.checkAllActiveEndpoints();
    } catch (error) {
      logger.error(`Initial health check error: ${error.message}`);
    }
  }, 5000); // Wait 5 seconds after startup
};

exports.stopHealthCheckWorker = () => {
  if (workerTask) {
    workerTask.stop();
    workerTask = null;
    logger.info('Health check worker stopped');
  }
};
