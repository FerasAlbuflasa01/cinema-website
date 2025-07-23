const express = require('express')
require('dotenv').config()
const session = require('express-session')
const bcrypt = require('bcrypt')
const app = express()
const path = require('path')
// Database Configuration
const mongoose = require('./config/db')

// Set the Port Configuration
const port = process.env.PORT ? process.env.PORT : '3000'

// Require Middleware
const methodOverride = require('method-override')
const morgan = require('morgan')
const passUserTOView = require('./middleware/pass-user-to-view')
const User = require('./models/user')
const firstAdmin = async () => {
  const listOfAdmin = await User.findOne({ username: 'admin' })
  if (!listOfAdmin) {
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
      username: 'admin2',
      email: 'test2@gmail.com',
      password: hashedPassword,
      role: 'admin'
    })
    console.log('First admin account created successfully!')
  } else {
    console.log('Admin account already exists.')
  }
}

firstAdmin()

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use('/uploads', express.static('public/uploads'))

// Use Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passUserTOView)
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

// Sesstion Configurations
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

// Require Routes
const authRouter = require('./routes/auth')
const movieRouter = require('./routes/moiveRoute')

//Use Routes
app.use('/auth', authRouter)

app.use('/movies', movieRouter)

app.listen(port, () => {
  console.log(`The app is ready on port ${port}`)
})
