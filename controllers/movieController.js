const Movie = require('../models/movie')
const Booking = require('../models/booking')
const User = require('../models/user')

exports.movie_create_get = async (req, res) => {
  if (req.session.user.role === 'user') {
    res.send('Error page not found!!!')
  } else {
    res.render('movie/new.ejs')
  }
}
exports.movie_create_post = async (req, res) => {
  // Check if the user role is 'admin'
  if (req.session.user.role === 'admin') {
    req.body.admin = req.session.user._id

    // Check if the movie already exists
    if (!(await Movie.findOne({ name: req.body.name }))) {
      const poster = req.file ? req.file.filename : null
      req.body.poster = poster

      await Movie.create(req.body)

      const movieId = await Movie.findOne({ name: req.body.name })
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
  const bookings = await Booking.find()
  res.render('movie/index.ejs', { movies: listOfMovies, bookings })
}
exports.movie_show_get = async (req, res) => {
  const movie = await Movie.findById(req.params.movieId)
  const booking = await Booking.findOne({ movie: req.params.movieId })
  res.render('movie/show.ejs', { movie, booking })
}

exports.movie_delete_delete = async (req, res) => {
  const currentMovie = await Movie.findById(req.params.movieId)
  const currentBooking = await Booking.findOne({ movie: req.params.movieId })
  if (
    currentMovie.admin.equals(req.session.user._id) &&
    req.session.user.role === 'admin'
  ) {
    await currentMovie.deleteOne()
    await currentBooking.deleteOne()
    res.redirect('/movies')
  } else {
    res.send("You don't have the permission to do that")
  }
}
exports.movie_update_get = async (req, res) => {
  if (req.session.user.role === 'user') {
    return res.send('Error page not found!!!')
  }
  const currentMovie = await Movie.findById(req.params.movieId)
  const currentBooking = await Booking.findOne({ movie: req.params.movieId })

  res.render('movie/edit.ejs', { movie: currentMovie, booking: currentBooking })
}

exports.movie_update_put = async (req, res) => {
  const currentMovie = await Movie.findById(req.params.movieId)
  const currentBooking = await Booking.findOne({ movie: req.params.movieId })

  if (
    currentMovie &&
    currentMovie.admin.equals(req.session.user._id) &&
    req.session.user.role === 'admin'
  ) {
    currentMovie.name = req.body.name
    currentMovie.description = req.body.description
    currentMovie.release_date = req.body.release_date
    currentMovie.movie_length = req.body.movie_length

    if (req.file) {
      currentMovie.poster = req.file.filename
    }

    await currentMovie.save()

    if (currentBooking) {
      currentBooking.theater = req.body.theater
      currentBooking.time = req.body.time
      currentBooking.date = req.body.date
      await currentBooking.save()
    }

    res.redirect(`/movies/${req.params.movieId}`)
  } else {
    res.send("You don't have permission to update this movie.")
  }
}

exports.movie_booking_get = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
  const movie = await Booking.findById(req.params.bookingId).populate('movie')
  res.render('movie/booking.ejs', { booking, movie })
}
exports.movie_booking_post = async (req, res) => {
  const movie = await Booking.findById(req.params.bookingId).populate('movie')
  const booking = await Booking.findById(req.params.bookingId)

  const user = await User.findByIdAndUpdate(req.session.user._id, {
    $push: {
      ticketHistory: {
        movie: movie.movie.name,
        date: booking.date,
        time: booking.time,
        seats: req.body.selectedSeats
      }
    }
  })

  const result = await Booking.findByIdAndUpdate(req.params.bookingId, {
    $addToSet: {
      bookedSeats: {
        $each: Array.isArray(req.body.unavailableSeats)
          ? req.body.unavailableSeats
          : req.body.unavailableSeats.split(',')
      }
    }
  })

  res.redirect('/movies')
}
exports.booking_api_get = async (req, res) => {
  const bookedSeats = await Booking.findById(req.params.bookingId)

  res.json(bookedSeats.bookedSeats)
}
