const Movies = require('../models/movies');
const { BadRequestError } = require('../scripts/errors/BadRequestError');
const { SUCCESS_CODE } = require('../scripts/utils');

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(SUCCESS_CODE).send(movie))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const type = Object.keys(e.errors);
        return next(new BadRequestError(`Неверный формат либо отсутствие данных: ${type}`));
      }

      next(e);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .populate('owner')
    .then((data) => res.status(SUCCESS_CODE).send(data))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;

  Movies.findById(id)
    .populate('owner')
    .then((movie) => {
      const ownerId = JSON.stringify(movie.owner._id);
      const userId = `"${req.user._id}"`;

      if (ownerId !== userId) {
        return Promise.reject(new Error('Нет прав на удаление этого фильма'));
      }

      Movies.deleteOne({ _id: id })
        .then(() => res.status(SUCCESS_CODE).send({ message: 'фильм успешно удален' }));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('Неверный id карточки'));
      }
      next(e);
    });
};
