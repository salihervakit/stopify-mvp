const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  songUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  placedAt: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Song', SongSchema)
