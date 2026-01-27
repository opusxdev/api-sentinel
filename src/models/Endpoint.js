const mongoose = require('mongoose');
const { HTTP_METHODS, CHECK_INTERVALS } = require('../config/constants');

const EndpointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add an endpoint name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please add a valid URL']
  },
  method: {
    type: String,
    enum: HTTP_METHODS,
    default: 'GET'
  },
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  body: {
    type: String,
    default: null
  },
  checkInterval: {
    type: Number,
    min: CHECK_INTERVALS.MIN,
    max: CHECK_INTERVALS.MAX,
    default: CHECK_INTERVALS.DEFAULT
  },
  status: {
    type: String,
    enum: ['up', 'down', 'degraded', 'unknown'],
    default: 'unknown'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastChecked: {
    type: Date,
    default: null
  },
  lastResponseTime: {
    type: Number,
    default: 0
  },
  lastStatusCode: {
    type: Number,
    default: null
  },
  notifications: {
    enabled: { type: Boolean, default: true },
    channels: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      slack: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// index for faster queriess
EndpointSchema.index({ user: 1, isActive: 1 });
EndpointSchema.index({ lastChecked: 1 });

module.exports = mongoose.model('Endpoint', EndpointSchema);