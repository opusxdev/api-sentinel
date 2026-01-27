const Joi = require('joi');

exports.validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

exports.validateEndpoint = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    url: Joi.string().uri().required(),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD').default('GET'),
    checkInterval: Joi.number().min(1).max(60).default(5),
    headers: Joi.object().pattern(Joi.string(), Joi.string()),
    body: Joi.string().allow(null, ''),
    notifications: Joi.object({
      enabled: Joi.boolean(),
      channels: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
        slack: Joi.boolean()
      })
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};