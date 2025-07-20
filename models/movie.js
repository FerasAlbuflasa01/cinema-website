const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  name: {
    Type: String,
    required: true
  },
  poster: {
    Type: String,
    require: true
  },
  description: {
    Type: String,
    required: true
  },
  release_date: {
    type: String,
    required: true
  },
  movie_length: {
    type: Number,
    required: true
  }
})
