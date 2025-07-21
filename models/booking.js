const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    theater: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
      },

    seat: {
        location: []
    }
  },

  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
