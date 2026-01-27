const app = require('./src/app');
const connectDB = require('./src/config/database')
const logger = require('./src/utils/logger');
const { startHealthCheckWorker } = require('./src/workers/healthCheckWorker');

const PORT = process.env.PORT || 5000;

// mongo connection 
connectDB();

startHealthCheckWorker();

const server = app.listen(PORT, () => {
  logger.info(`API-Sentinel running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});