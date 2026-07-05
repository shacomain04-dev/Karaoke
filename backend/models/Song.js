const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  artist: {
    type: String,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    default: 'Unknown'
  },
  lyrics: {
    type: String
  },
  videoUrl: {
    type: String
  },
  youtubeId: {
    type: String,
    index: true
  },
  imageUrl: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

songSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = mongoose.model('Song', songSchema);
