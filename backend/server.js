const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/karaoke')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const sessionRoutes = require('./routes/sessions');
const songRoutes = require('./routes/songs');
const queueRoutes = require('./routes/queue');

// API Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/queue', queueRoutes);

// WebSocket Events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a session room
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    io.to(sessionId).emit('user-joined', {
      userId: socket.id,
      timestamp: new Date()
    });
  });

  // Add song to queue
  socket.on('add-to-queue', (data) => {
    io.to(data.sessionId).emit('queue-updated', data);
  });

  // Play song
  socket.on('play-song', (data) => {
    io.to(data.sessionId).emit('now-playing', data);
  });

  // Skip song
  socket.on('skip-song', (data) => {
    io.to(data.sessionId).emit('song-skipped', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
