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
        theater: {
          type: String
        },
        movie: {
          type: String
        },
        time: {
          type: String
        },
        date: {
          type: String
        },
        seats: {
          type: [String]
        },
        createdAt: {
          type: Date,
          default: Date.now // Automatically set to the current date and time
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
