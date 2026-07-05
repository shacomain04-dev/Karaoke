const express = require('express');
const router = express.Router();
const QueueItem = require('../models/QueueItem');
const Session = require('../models/Session');
const Song = require('../models/Song');

// Get queue for session
router.get('/:sessionId', async (req, res) => {
  try {
    const queue = await QueueItem.find({ sessionId: req.params.sessionId })
      .populate('song')
      .sort('position');
    res.json(queue);
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Add song to queue
router.post('/:sessionId/add', async (req, res) => {
  try {
    const { songId, userId, username } = req.body;
    
    // Get current queue length to determine position
    const queueItems = await QueueItem.find({ sessionId: req.params.sessionId });
    const position = queueItems.length + 1;

    const queueItem = new QueueItem({
      sessionId: req.params.sessionId,
      song: songId,
      userId,
      username,
      position,
      status: 'waiting'
    });

    await queueItem.save();

    // Add to session queue
    await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $push: { queue: queueItem._id } }
    );

    res.json({
      success: true,
      queueItem,
      message: 'Song added to queue'
    });
  } catch (error) {
    console.error('Error adding to queue:', error);
    res.status(500).json({ error: 'Failed to add song to queue' });
  }
});

// Remove from queue
router.delete('/:sessionId/:queueItemId', async (req, res) => {
  try {
    await QueueItem.findByIdAndDelete(req.params.queueItemId);
    
    await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $pull: { queue: req.params.queueItemId } }
    );

    res.json({ success: true, message: 'Removed from queue' });
  } catch (error) {
    console.error('Error removing from queue:', error);
    res.status(500).json({ error: 'Failed to remove from queue' });
  }
});

// Skip current song
router.post('/:sessionId/skip', async (req, res) => {
  try {
    const queue = await QueueItem.find({ sessionId: req.params.sessionId })
      .sort('position');

    if (queue.length > 0) {
      queue[0].status = 'skipped';
      await queue[0].save();
    }

    res.json({ success: true, message: 'Song skipped' });
  } catch (error) {
    console.error('Error skipping song:', error);
    res.status(500).json({ error: 'Failed to skip song' });
  }
});

module.exports = router;
