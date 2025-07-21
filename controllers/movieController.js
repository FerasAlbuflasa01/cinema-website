const Movie = require('../models/movie')
const Booking = require('../models/booking')


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
      const movieId = Movie.findOne({name:req.body.name})
      await Booking.create({
        theater: req.body.theater,
        time: req.body.time,
        date: req.body.date,
        movie: movieId._id
      })
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


exports.movie_delete_delete = async (req, res) => {
  const currentMovie = await Movie.findById(req.params.movieId);
  if(currentMovie.admin.equals(req.session.user_id)){
    //need to change the following  ''await currentListing.updateOne(req.body);''
  }else{
    //res.send("");
  }
}