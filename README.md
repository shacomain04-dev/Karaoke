# 🎤 Video Karaoke System with QR Code Controller

A full-stack karaoke application where users can sing songs by searching through a mobile controller accessed via QR code. Features real-time synchronization, song queuing, and lyrics display.

## Features

✨ **QR Code Login** - Users scan QR to access the controller on their phone
🎵 **Song Search** - Search and add songs to the queue
📱 **Mobile Controller** - Full control from smartphones
🎬 **Main Display** - Large screen shows lyrics and currently playing song
🔄 **Real-time Sync** - Live updates across all devices using WebSocket
👥 **Multi-user Support** - Multiple singers can queue up
⏱️ **Queue Management** - See who's singing next

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Real-time**: WebSocket (Socket.io)
- **Database**: MongoDB
- **QR Code**: qrcode.react
- **Deployment**: Vercel

## Project Structure

```
karaoke-system/
├── backend/              # Express server
│   ├── routes/
│   ├── models/
│   └── server.js
├── frontend/             # React app
│   ├── components/
│   ├── pages/
│   └── App.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/shacomain04-dev/Karaoke.git
cd Karaoke
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm start
```

## Usage

1. **Host starts the main display** - Opens the karaoke display screen
2. **Users scan QR code** - Access controller on their mobile device
3. **Users search and add songs** - Queue up their favorite tracks
4. **Songs play in order** - Main display shows lyrics and video
5. **Real-time updates** - Everyone sees the queue and current song

## API Endpoints

- `POST /api/sessions/create` - Create a new karaoke session
- `GET /api/songs/search` - Search for songs
- `POST /api/queue/add` - Add song to queue
- `GET /api/queue` - Get current queue
- `WebSocket events` - Real-time updates

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
