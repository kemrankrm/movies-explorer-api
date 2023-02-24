const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { usersRouter } = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { moviesRouter } = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsbd');

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT:', PORT);
});
