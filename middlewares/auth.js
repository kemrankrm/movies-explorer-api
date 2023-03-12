const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../scripts/errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  const { NODE_ENV, JWT_SECRET } = process.env;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
