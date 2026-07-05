import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Controller.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Controller({ socket }) {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sid = searchParams.get('sessionId');
    if (sid) {
      setSessionId(sid);
    }
  }, [searchParams]);

  useEffect(() => {
    if (socket && sessionId) {
      socket.on('queue-updated', (data) => {
        fetchQueue();
      });

      return () => {
        socket.off('queue-updated');
      };
    }
  }, [socket, sessionId]);

  const joinSession = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axios.post(`${API_URL}/api/sessions/${sessionId}/join`, {
        userId: 'user-' + Date.now(),
        username
      });

      if (socket) {
        socket.emit('join-session', sessionId);
      }

      setJoined(true);
      fetchQueue();
    } catch (err) {
      setError('Failed to join session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/songs/search`, {
        params: { q: searchQuery }
      });
      setSongs(response.data.songs || []);
    } catch (err) {
      setError('Failed to search songs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/queue/${sessionId}`);
      setQueue(response.data || []);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    }
  };

  const addToQueue = async (songId) => {
    try {
      await axios.post(`${API_URL}/api/queue/${sessionId}/add`, {
        songId,
        userId: 'user-' + Date.now(),
        username
      });

      if (socket) {
        socket.emit('add-to-queue', { sessionId, timestamp: new Date() });
      }

      setSearchQuery('');
      setSongs([]);
      fetchQueue();
    } catch (err) {
      setError('Failed to add song: ' + err.message);
    }
  };

  if (!joined) {
    return (
      <div className="controller-page">
        <div className="container">
          <div className="card" style={{ marginTop: '100px' }}>
            <h2>Join Karaoke Session</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={joinSession}
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? 'Joining...' : 'Join Session'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="controller-page">
      <div className="container">
        <div className="page-header">
          <h1>🎤 Find Your Song</h1>
          <p>Welcome, {username}!</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a song or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchSongs()}
          />
          <button className="btn-primary" onClick={searchSongs} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {songs.length > 0 && (
          <div className="songs-list">
            <h3>Search Results</h3>
            {songs.map((song) => (
              <div key={song._id} className="song-item">
                <div className="song-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => addToQueue(song._id)}
                >
                  Add to Queue
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="queue-info">
          <h3>Queue ({queue.length} songs)</h3>
          {queue.slice(0, 5).map((item, index) => (
            <div key={item._id} className="queue-item">
              <span className="queue-position">#{index + 1}</span>
              <span className="queue-details">
                {item.song?.title} - {item.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Controller;
