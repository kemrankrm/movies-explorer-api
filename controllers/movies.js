const Movies = require('../models/movies');

module.exports.addMovie = (req, res) => {
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
    .then((movie) => res.status(200).send(movie))
    .catch((e) => res.status(400).send({ message: e.message }));
};

module.exports.getMovies = (req, res) => {
  Movies.find({ owner: req.user._id })
    .populate('owner')
    .then((data) => res.status(200).send(data))
    .catch((e) => res.status(400).send({ message: e.message }));
};

module.exports.deleteMovie = (req, res) => {
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
        .then(() => res.status(200).send({ message: 'фильм успешно удален' }));
    })
    .catch((e) => res.status(400).send({ message: e.message }));
};
