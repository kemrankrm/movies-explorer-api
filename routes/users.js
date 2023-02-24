const usersRouter = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/users');

usersRouter.get('/me', getProfile);

usersRouter.patch('/me', updateProfile);

module.exports = {
  usersRouter,
};
