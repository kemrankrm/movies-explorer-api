const moviesRouter = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', addMovie);
moviesRouter.delete('/:id', deleteMovie);

module.exports = {
  moviesRouter,
};
