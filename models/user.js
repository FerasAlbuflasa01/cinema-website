const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    ticketHistory: [
      {
        movie: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true
        },
        seats: {
          type: [String], // Array of strings for seat identifiers
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
