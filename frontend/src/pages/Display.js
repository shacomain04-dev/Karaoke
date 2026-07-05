import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Display.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Display({ socket }) {
  const { sessionId } = useParams();
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    if (socket && sessionId) {
      socket.emit('join-session', sessionId);

      socket.on('now-playing', (data) => {
        setCurrentSong(data.song);
      });

      socket.on('queue-updated', () => {
        fetchQueue();
      });

      socket.on('user-joined', (data) => {
        setParticipants((prev) => prev + 1);
      });

      fetchQueue();

      return () => {
        socket.off('now-playing');
        socket.off('queue-updated');
        socket.off('user-joined');
      };
    }
  }, [socket, sessionId]);

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/queue/${sessionId}`);
      setQueue(response.data || []);

      // Set first song as current if none is playing
      if (!currentSong && response.data.length > 0) {
        setCurrentSong(response.data[0].song);
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    }
  };

  return (
    <div className="display-page">
      {currentSong ? (
        <div className="now-playing">
          <div className="song-display">
            {currentSong.imageUrl && (
              <img src={currentSong.imageUrl} alt={currentSong.title} />
            )}
            <h1>{currentSong.title}</h1>
            <h2>{currentSong.artist}</h2>
            {currentSong.lyrics && (
              <div className="lyrics">
                {currentSong.lyrics.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="standby">
          <h1>🎤 Welcome to Karaoke!</h1>
          <p>Waiting for songs...</p>
          <p>Participants: {participants}</p>
        </div>
      )}

      <div className="queue-display">
        <h3>Next Up</h3>
        {queue.slice(1, 6).map((item, index) => (
          <div key={item._id} className="queue-preview">
            <span className="number">#{index + 2}</span>
            <span className="title">{item.song?.title}</span>
            <span className="singer">{item.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;
