const express = require('express')
require('dotenv').config()
const session = require('express-session')

const app = express()

// Database Configuration
const mangoose = require('./config/db')

// Set the Port Configuration
const port = process.env.POTR ? process.env.POTR : '3000'

// Require Middleware
const methodOverride = require('method-override')
const morgan = require('morgan')

// Use Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(methodOverride('_method'))
app.use(morgan('dev'))

// Sesstion Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

// Require Routes
const authRouter = require('./routes/auth')
const authAdminRouter = require('./routes/authAdmin')
const movieRouter = require('./routes/moiveRoute')

//Use Routes
app.use('/auth', authRouter)
app.use('/admin/auth', authAdminRouter)
app.use('/movies', movieRouter)

app.listen(port, () => {
  console.log(`The app is ready on port ${port}`)
})
