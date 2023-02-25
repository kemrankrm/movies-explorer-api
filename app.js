require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { usersRouter } = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { moviesRouter } = require('./routes/movies');
const { catchErrors } = require('./middlewares/catchErrors');
const { NotFoundError } = require('./scripts/errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsbd');

app.use(requestLogger);


app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().max(30).min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('*', (req, res, next) => next(new NotFoundError('404 Not found')));

app.use(errorLogger);
app.use(errors());
app.use(catchErrors);

app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT:', PORT);
});
