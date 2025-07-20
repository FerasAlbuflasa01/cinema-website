const session = require('express-session')
const Movie = require('../models/movie')

exports.movie_create_get = async (req, res) => {
  res.render('movie/new.ejs')
}
exports.movie_create_post = async (req, res) => {
  if (session.user.role.equals('admin')) {
    req.body.admin = session.user._id
    if (!(await Movie.find(req.body.name))) {
      await Movie.create(req.body)
      res.redirect('/')
    } else {
      res.send('alredy exsist!!!')
    }
  } else {
    res.send("you don't have permission")
  }
}
