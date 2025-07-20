const User = require('../models/user.js')
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
    lastName: req.body.lastName
  })
  res.send(`Thanks for signing up ${user.firstName} ${user.lastName}`)
}

exports.auth_signin_get = async (req, res) => {
  res.render('auth/sign-in.ejs')
}

exports.auth_signin_post = async (req, res) => {
  const userInDatadase = await User.findOne({ email: req.body.email })
  if (!userInDatadase) {
    return res.send('Login failed. Please try again.')
  }
  const validPassword = bcrept.compareSync(
    req.body.password,
    userInDatadase.password
  )
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }

  req.session.user = {
    email: userInDatadase.email,
    _id: userInDatadase._id
  }
  res.redirect('/')
}

exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.send('sing out')
}
