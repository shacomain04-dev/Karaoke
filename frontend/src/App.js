import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './pages/Home';
import Host from './pages/Host';
import Controller from './pages/Controller';
import Display from './pages/Display';
import './styles/App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host socket={socket} />} />
        <Route path="/join" element={<Controller socket={socket} />} />
        <Route path="/display/:sessionId" element={<Display socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
