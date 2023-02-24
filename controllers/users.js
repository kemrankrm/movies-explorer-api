const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

module.exports.getProfile = (req, res) => {
  const id = req.user._id;

  Users.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((e) => res.status(400).send({ message: e.message }));
};

module.exports.createUser = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch((e) => res.status(400).send({ message: e.message }));
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '1d' },
      );
      res.status(200).send({ token });
    })
    .catch((e) => res.status(400).send({ message: e.message, name: e.name }));
};

module.exports.updateProfile = (req, res) => {
  const { email, name } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => res.status(400).send({ message: e.message }));
};
