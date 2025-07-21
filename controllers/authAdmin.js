const User = require('../models/admin')
const bcrept = require('bcrypt')

//API's
exports.auth_signup_get = async (req, res) => {
  res.render('authAdmin/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('username already taken!')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and confirm password must mutch...')
  }

  const hashedPassword = bcrept.hashSync(req.body.password, 10)

  req.body.password = hashedPassword

  const user = await User.create({
    username: req.body.username,
    password: hashedPassword,
    role: 'admin'
  })
  res.redirect('/admin/auth/sign-in')
}

exports.auth_signin_get = async (req, res) => {
  res.render('authAdmin/sign-in.ejs')
}
// Ensure bcrypt is imported
// Adjust path as necessary

exports.auth_signin_post = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })

    if (!userInDatabase) {
      return res.send('Login failed. Please try again.') // Generic message
    }

    const validPassword = bcrept.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send('Login failed. Please try again.') // Generic message
    }

    // Store user info in session
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role
    }

    console.log('User logged in:', req.session.user)
    res.redirect('/admin')
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).send('Internal server error. Please try again later.')
  }
}
exports.auth_signout_get = (req, res) => {
  req.session.destroy()
  res.send('sing out')
}
