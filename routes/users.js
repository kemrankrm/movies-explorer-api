const usersRouter = require('express').Router();
const { getProfile, createUser } = require('../controllers/users');

usersRouter.get('/me', getProfile);

module.exports = {
  usersRouter,
};
