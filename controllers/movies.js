const Movies = require('../models/movies');
const { BadRequestError } = require('../scripts/errors/BadRequestError');
const { SUCCESS_CODE } = require('../scripts/constants');
const { AuthoritiesError } = require('../scripts/errors/AuthoritiesError');
const { NotFoundError } = require('../scripts/errors/NotFound');

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

      return next(e);
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
    .orFail(() => {
      throw new NotFoundError(`Передан несуществующий id (${id}) карточки`);
    })
    .populate('owner')
    .then((movie) => {
      const ownerId = JSON.stringify(movie.owner._id);
      const userId = `"${req.user._id}"`;

      if (ownerId !== userId) {
        return Promise.reject(new AuthoritiesError('Нет прав на удаление этого фильма'));
      }

      return Movies.deleteOne({ _id: id })
        .then(() => res.status(SUCCESS_CODE).send({ message: 'фильм успешно удален' }));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('Неверный id карточки'));
      }
      return next(e);
    });
};
