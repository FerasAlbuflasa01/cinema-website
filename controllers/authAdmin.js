const User = require('../models/admin')
const bcrept = require('bcrypt')

//API's
exports.auth_signup_get = async (req, res) => {
  res.render('authAdmin/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('email already taken!')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and confirm password must mutch...')
  }

  const hashedPassword = bcrept.hashSync(req.body.password, 10)

  req.body.password = hashedPassword

  const user = await User.create({
    username: req.body.username,
    password: hashedPassword
  })
  res.send(`Thanks for signing up ${user.username}`)
}

exports.auth_signin_get = async (req, res) => {
  res.render('authAdmin/sign-in.ejs')
}

exports.auth_signin_post = async (req, res) => {
  const userInDatadase = await User.findOne({ username: req.body.username })

  if (!userInDatadase) {
    return res.send('Login failed. Please try again. here')
  }
  const validPassword = bcrept.compareSync(
    req.body.password,
    userInDatadase.password
  )
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }

  req.session.user = {
    username: userInDatadase.username,
    _id: userInDatadase._id,
    role: userInDatadase.role
  }
  res.redirect('/movies')
}

exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.send('sing out')
}
