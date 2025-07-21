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
const passUserTOView = require('./middleware/pass-user-to-view')
const firstAdmin = require('./config/firstAdmin')
const isSignedIn = require('./middleware/is-signed-in')
const isAdmin = require('./middleware/isAdmin')

app.use(firstAdmin)
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
