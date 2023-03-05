const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { NotFoundError } = require('../scripts/errors/NotFound');
const { BadRequestError } = require('../scripts/errors/BadRequestError');
const { SUCCESS_CODE } = require('../scripts/constants');
const { RegistrationError } = require('../scripts/errors/RegistrationError');

module.exports.getProfile = (req, res, next) => {
  const id = req.user._id;

  Users.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь id:${id} не найден`);
      }
      return res.status(SUCCESS_CODE).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('Неверные данные id'));
      }
      next(e);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const data = user;
          data.password = undefined;
          return res.status(SUCCESS_CODE).send(data);
        })
        .catch((e) => {
          if (e.code === 11000) {
            return next(new RegistrationError('Такой email уже зарегистрирован'));
          }

          if (e.name === 'ValidationError') {
            return next(new BadRequestError('Введены неверные данные'));
          }

          return next(e);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.status(SUCCESS_CODE).send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Профиль не найден');
    })
    .then((user) => {
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return next(new BadRequestError('Формат данных неверный'));
      }
      next(e);
    });
};
