const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const Movie = require('../models/movie')
const Booking = require('../models/booking')

//API's

exports.auth_signup_get = async (req, res) => {
  res.render('auth/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })

  if (userInDatabase) {
    return res.send('Username already taken!')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and confirm password must match...')
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10)

  req.body.password = hashedPassword

  const profilePic = req.file ? req.file.filename : null

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: 'user',
    profilePic: profilePic
  })
  res.render('auth/sign-in.ejs')
}

exports.auth_signin_get = async (req, res) => {
  res.render('auth/sign-in.ejs')
}

exports.auth_signin_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })

  let user

  if (userInDatabase) {
    user = userInDatabase
  } else {
    return res.send('Login failed. Please try again.')
  }

  const validPassword = bcrypt.compareSync(req.body.password, user.password)
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }

  req.session.user = {
    username: user.username,
    _id: user._id,
    role: userInDatabase.role,
    profilePic: user.profilePic
  }

  const listOfMovies = await Movie.find()
  const bookings = await Booking.find()
  res.render('movie/index.ejs', { movies: listOfMovies, bookings, user })
}

exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

exports.auth_edit_get = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('auth/edit.ejs', { user })
}

exports.auth_edit_put = async (req, res) => {
  const user = await User.findById(req.session.user._id)

  user.username = req.body.username
  user.email = req.body.email

  if (req.file) {
    user.profilePic = req.file.filename
  }

  if (req.body.currentPassword && req.body.newPassword) {
    const isMatch = bcrypt.compareSync(req.body.currentPassword, user.password)

    if (!isMatch) {
      return res.send('Wrong password')
    }

    const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 10)
    user.password = hashedNewPassword
  }

  await user.save()

  req.session.user.username = user.username
  req.session.user.email = user.email
  req.session.user.profilePic = user.profilePic

  res.redirect('/')
}

exports.auth_showTickets_get = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('auth/index.ejs', { user })
}
