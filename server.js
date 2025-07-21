const express = require('express')
require('dotenv').config()
const session = require('express-session')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const app = express()

// Database Configuration
const mangoose = require('./config/db')

// Set the Port Configuration
const port = process.env.POTR ? process.env.POTR : '3000'

// Require Middleware
const methodOverride = require('method-override')
const morgan = require('morgan')

// upload file
const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

// Use Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(methodOverride('_method'))
app.use(morgan('dev'))

// Session Configurations
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

// Use Routes
app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`The app is ready on port ${port}`)
})
