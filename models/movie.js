const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  release_date: {
    type: String,
    required: true
  },
  movie_length: {
    type: Number,
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
})
const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie
