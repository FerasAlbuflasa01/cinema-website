const User = require('../models/user.js')
const Admin = require('../models/admin')
const bcrept = require('bcrypt')

//API's
exports.auth_signup_get = async (req, res) => {
  res.render('auth/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ email: req.body.email })
  if (userInDatabase) {
    return res.send('email already taken!')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and confirm password must mutch...')
  }

  const hashedPassword = bcrept.hashSync(req.body.password, 10)

  req.body.password = hashedPassword

  const user = await User.create({
    email: req.body.email,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: 'user'
  })
  res.send(`Thanks for signing up ${user.firstName} ${user.lastName}`)
}

exports.auth_signin_get = async (req, res) => {
  res.render('auth/sign-in.ejs')
}

exports.auth_signin_post = async (req, res) => {
  // Check for user by email
  const userInDatabase = await User.findOne({ email: req.body.email })
  const adminInDatabase = await Admin.findOne({ username: req.body.email }) // Assuming admin uses email as username

  let user

  // Determine if the user is an admin or a regular user
  if (userInDatabase) {
    user = userInDatabase // Regular user found
  } else if (adminInDatabase) {
    user = adminInDatabase // Admin found
  } else {
    return res.send('Login failed. Please try again.')
  }

  // Check password validity
  const validPassword = bcrept.compareSync(req.body.password, user.password)
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }

  // Set session based on user role
  req.session.user = {
    email: user.email || user.username, // Use email for regular users and username for admins
    _id: user._id,
    role: user.role || 'admin' // Default to 'admin' if it's an admin
  }

  // Redirect based on role
  if (user.role === 'admin') {
    console.log(req.session.user)
    res.redirect('/') // Redirect admin to admin dashboard
  } else {
    console.log(req.session.user)
    res.redirect('/') // Redirect regular user to home
  }
}
exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.send('sing out')
}
