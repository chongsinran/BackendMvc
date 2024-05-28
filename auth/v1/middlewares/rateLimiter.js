const rateLimit = require('express-rate-limit');
//SAME IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  headers: true,
});

module.exports = loginLimiter;