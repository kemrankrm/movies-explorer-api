const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { urlRegexPattern } = require('../scripts/utils');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegexPattern),
    nameRU: Joi.string().required(),
    trailerLink: Joi.string().required().pattern(urlRegexPattern),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlRegexPattern),
    movieId: Joi.string().length(24).required().hex(),
  }),
}), addMovie);

moviesRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).required().hex(),
  }).unknown(true),
}), deleteMovie);

module.exports = {
  moviesRouter,
};
