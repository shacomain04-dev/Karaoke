const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Search songs
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const skip = (page - 1) * limit;

    // Text search or regex search
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } }
      ]
    })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ rating: -1, views: -1 });

    const total = await Song.countDocuments({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } }
      ]
    });

    res.json({
      songs,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Failed to search songs' });
  }
});

// Get popular songs
router.get('/popular', async (req, res) => {
  try {
    const limit = req.query.limit || 20;

    const songs = await Song.find()
      .sort({ rating: -1, views: -1 })
      .limit(parseInt(limit));

    res.json(songs);
  } catch (error) {
    console.error('Error fetching popular songs:', error);
    res.status(500).json({ error: 'Failed to fetch popular songs' });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Increment views
    song.views += 1;
    await song.save();

    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Add new song (admin only)
router.post('/add', async (req, res) => {
  try {
    const { title, artist, duration, genre, lyrics, videoUrl, youtubeId, imageUrl } = req.body;

    const song = new Song({
      title,
      artist,
      duration,
      genre,
      lyrics,
      videoUrl,
      youtubeId,
      imageUrl
    });

    await song.save();

    res.status(201).json({
      success: true,
      song
    });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ error: 'Failed to add song' });
  }
});

module.exports = router;
