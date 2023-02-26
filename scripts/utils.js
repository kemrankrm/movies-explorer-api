const rateLimit = require('express-rate-limit');
const { PERIOD_MINUTES_10 } = require('./constants');

const apiLimiter = rateLimit({
  windowMs: PERIOD_MINUTES_10,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
};
