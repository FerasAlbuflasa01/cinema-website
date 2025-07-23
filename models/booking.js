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
      type: Date,
      required: true
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },

    bookedSeats: {
      type: [String]
    }
  },

  {
    timestamps: true
  }
)

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
