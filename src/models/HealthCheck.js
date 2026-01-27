const mongoose = require('mongoose');

const HealthCheckSchema = new mongoose.Schema({
  endpoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endpoint',
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'timeout', 'error'],
    required: true
  },
  statusCode: {
    type: Number,
    default: null
  },
  responseTime: {
    type: Number,
    required: true
  },
  responseSize: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: null
  },
  checkedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for faster analytics queries
HealthCheckSchema.index({ endpoint: 1, checkedAt: -1 });
HealthCheckSchema.index({ checkedAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

module.exports = mongoose.model('HealthCheck', HealthCheckSchema);