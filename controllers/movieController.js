const Movie = require('../models/movie')

exports.movie_create_get = async (req, res) => {
  if (req.session.user.role === 'user') {
    res.send('Error page not found!!!')
  }
  res.render('movie/new.ejs')
}
exports.movie_create_post = async (req, res) => {
  // Check if the user role is 'admin'
  if (req.session.user.role === 'admin') {
    req.body.admin = req.session.user._id

    // Check if the movie already exists
    if (!(await Movie.findOne({ name: req.body.name }))) {
      await Movie.create(req.body)
      res.redirect('/movies')
    } else {
      res.send('already exists!!!')
    }
  } else {
    res.send("you don't have permission")
  }
}
exports.movie_index_get = async (req, res) => {
  const listOfMovies = await Movie.find()
  res.render('movie/index.ejs', { movies: listOfMovies })
}
