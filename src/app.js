const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config()

const authRoutes = require('./routes/auth');
const endpointRoutes = require('./routes/endpoints');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// express app 
const app = express();

app.use(helmet());
// TODO - FRONTEND URL CONFIG
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',     
  credentials: true
}))

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limiter each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// healthCheckPoint 
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });

})

// apiRoutes
app.use('/api/auth', authRoutes);
app.use('/api/endpoints', endpointRoutes);
app.use('/api/analytics', analyticsRoutes);

// for 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// errorHandler 
app.use(errorHandler);

module.exports = app;
