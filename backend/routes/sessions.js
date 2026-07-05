const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

// Create new session
router.post('/create', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const qrData = `${process.env.CLIENT_URL || 'http://localhost:3000'}/join?sessionId=${sessionId}`;
    
    // Generate QR code
    const qrCode = await qrcode.toDataURL(qrData);

    // Create session in database
    const session = new Session({
      sessionId,
      qrCode,
      hostId: req.body.hostId || 'host',
      status: 'active'
    });

    await session.save();

    res.json({
      success: true,
      sessionId,
      qrCode,
      joinUrl: qrData
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId })
      .populate('queue');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Join session
router.post('/:sessionId/join', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participant = {
      userId: req.body.userId,
      username: req.body.username,
      joinedAt: new Date()
    };

    // Check if user already in session
    const exists = session.participants.find(p => p.userId === req.body.userId);
    if (!exists) {
      session.participants.push(participant);
      await session.save();
    }

    res.json({
      success: true,
      sessionId: session.sessionId,
      message: 'Joined session successfully'
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// End session
router.post('/:sessionId/end', async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { status: 'ended' },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Session ended'
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

module.exports = router;
