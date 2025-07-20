const Movie = require('../models/movie')

exports.movie_create_get((req, res) => {
  res.render('movie/new.ejs')
})
exports.movie_create_post((req, res) => {
  req.body.admin = session.user._id
  Movie.create(req.body)
  res.redirect('/')
})
