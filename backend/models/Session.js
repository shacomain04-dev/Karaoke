const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  hostId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended'],
    default: 'active'
  },
  currentSong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    default: null
  },
  queue: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QueueItem'
  }],
  participants: [{
    userId: String,
    username: String,
    joinedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000)
  }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
