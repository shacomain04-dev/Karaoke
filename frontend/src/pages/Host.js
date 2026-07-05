import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import '../styles/Host.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Host({ socket }) {
  const [sessionId, setSessionId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/sessions/create`, {
        hostId: 'host-' + Date.now()
      });

      setSessionId(response.data.sessionId);
      setQrCode(response.data.qrCode);

      if (socket) {
        socket.emit('join-session', response.data.sessionId);
      }
    } catch (err) {
      setError('Failed to start session: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-page">
      <div className="container">
        <div className="page-header">
          <h1>🎤 Host Karaoke Session</h1>
          <p>Create a new session and invite your friends</p>
        </div>

        {error && <div className="error">{error}</div>}

        {!sessionId ? (
          <div className="card">
            <h2>Ready to start?</h2>
            <p>Click the button below to create a new karaoke session</p>
            <button
              className="btn-primary"
              onClick={startSession}
              disabled={loading}
            >
              {loading ? 'Creating Session...' : 'Start Session'}
            </button>
          </div>
        ) : (
          <div className="host-session">
            <div className="card">
              <h2>Session Created!</h2>
              <p>Session ID: <strong>{sessionId}</strong></p>
              <p>Share this QR code with your friends to join</p>
            </div>

            <div className="qr-container">
              <div className="qr-code">
                <QRCode value={qrCode} size={256} level="H" />
              </div>
            </div>

            <div className="card">
              <h3>What's next?</h3>
              <ul>
                <li>Share the QR code with friends</li>
                <li>They scan it on their phone</li>
                <li>They search and add songs</li>
                <li>Songs play in order on the main display</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Host;
