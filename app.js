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
const { allowRequest } = require('./middlewares/cors');
const { apiLimiter } = require('./scripts/utils');

const { PORT = 3000 } = process.env;
const app = express();

// Лимитирование запросов
app.use('/', apiLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsbd');

// CORS миддлвар
app.use(allowRequest);

// Логирование запросов
app.use(requestLogger);

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().max(30).min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// Авторизацияя
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

// Аутентификация (защита роутов от неавторизированых юзеров)
app.use(auth);

// Основные роуты
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

// Неизвестный роут
app.use('*', (req, res, next) => next(new NotFoundError('404 Not found')));

// Логирование ошибок
app.use(errorLogger);
// Миддлвар для ошибок валидации celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(catchErrors);

app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT:', PORT);
});
