const express = require('express')
require('dotenv').config()
const session = require('express-session')
const bcrypt = require('bcrypt')
const app = express()

// Database Configuration
const mangoose = require('./config/db')

// Set the Port Configuration
const port = process.env.POTR ? process.env.POTR : '3000'

// Require Middleware
const methodOverride = require('method-override')
const morgan = require('morgan')
const passUserTOView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')
const isAdmin = require('./middleware/isAdmin')
const User = require('./models/user')
const firstAdmin = async () => {
  const listOfAdmin = await User.findOne({ username: 'admin' })
  if (!listOfAdmin) {
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
      username: 'admin',
      email: 'test@gmail.com',
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

// Use Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passUserTOView)
app.use(methodOverride('_method'))
app.use(morgan('dev'))

// Sesstion Configurations

// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null
//   next()
// })

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

// app.get('/admin', async (req, res) => {
//   res.render('index.ejs')
// })

// Require Routes
const authRouter = require('./routes/auth')
const movieRouter = require('./routes/moiveRoute')

//Use Routes
app.use('/auth', authRouter)
// app.use('/admin/auth', authAdminRouter)
// app.use('/admin/movies', isAdmin, movieRouter)
app.use('/movies', movieRouter)

app.listen(port, () => {
  console.log(`The app is ready on port ${port}`)
})
