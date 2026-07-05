import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>🎤 Karaoke Hub</h1>
          <p>Sing your heart out with friends!</p>
        </div>

        <div className="home-grid">
          <div className="home-card">
            <h2>🎵 Host a Session</h2>
            <p>Start a new karaoke session and invite friends</p>
            <button className="btn-primary" onClick={() => navigate('/host')}>
              Start Hosting
            </button>
          </div>

          <div className="home-card">
            <h2>📱 Join via QR Code</h2>
            <p>Scan the QR code to join and sing</p>
            <button className="btn-primary" onClick={() => navigate('/join')}>
              Scan QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
