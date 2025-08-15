require('dotenv').config();
const app = require('./app');
const http = require('http');
const { initSocket } = require('./src/services/realtimeService');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time features
const io = initSocket(server);

console.log('Environment variables loaded:');
console.log('- FIRESTORE_PROJECT_ID:', process.env.FIRESTORE_PROJECT_ID || 'Not set');
console.log('- FIRESTORE_DATABASE_ID:', process.env.FIRESTORE_DATABASE_ID || 'Not set');
console.log('- LANGUAGE_API_URL:', process.env.LANGUAGE_API_URL || 'Not set');
console.log('- YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? 'Set' : 'Not set');

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics`);
  console.log(`🤖 Sentiment API: http://localhost:${PORT}/api/sentiment`);
  console.log(`📡 Data Sources API: http://localhost:${PORT}/api/data`);
  console.log(`⚡ Real-time WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});