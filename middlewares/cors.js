const {
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
} = require('../scripts/constants');

const allowRequest = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  console.log('CORUS MIDDLE WARE OK');

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('ORIGIN OK', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};

module.exports = {
  allowRequest,
};
