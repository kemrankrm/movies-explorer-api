const SUCCESS_CODE = 200;
const PERIOD_MINUTES_10 = 600000;

const urlRegexPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const allowedCors = [
  'https://diploma-kk.nomoredomains.work',
  'http://diploma-kk.nomoredomains.work',
  'localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  SUCCESS_CODE,
  PERIOD_MINUTES_10,
  urlRegexPattern,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
