const User = require('../models/user.js')
const bcrept = require('bcrypt')

//API's
exports.auth_signup_get = async (req, res) => {
  res.render('auth/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email })
    if (userInDatabase) {
      return res.send('email already taken!')
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and confirm password must match...')
    }

    const hashedPassword = bcrept.hashSync(req.body.password, 10)

    const userData = {
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: 'user'
    }

    if (req.file) {
      userData.profilePic = req.file.filename
    }

    const user = await User.create(userData)

    res.send(`Thanks for signing up ${user.firstName} ${user.lastName}`)
  } catch (error) {
    res.status(500).send(error.message)
  }
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

exports.auth_edit_get = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render('auth/edit.ejs', { user })
}

exports.auth_edit_put = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in')
  }

  const user = await User.findById(req.session.user._id)
  if (!user) {
    return res.status(404).send('User not found')
  }

  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.email = req.body.email

  if (req.file) {
    user.profilePic = req.file.filename
  }

  if (req.body.currentPassword && req.body.newPassword) {
    const isMatch = bcrept.compareSync(req.body.currentPassword, user.password)
    if (!isMatch) {
      return res.send('Wrong password')
    }

    const hashedNewPassword = bcrept.hashSync(req.body.newPassword, 10)
    user.password = hashedNewPassword
  }

  await user.save()
  res.redirect('/')
}
