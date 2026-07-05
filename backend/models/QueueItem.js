const mongoose = require('mongoose');

const queueItemSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'completed', 'skipped'],
    default: 'waiting'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  votes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QueueItem', queueItemSchema);
