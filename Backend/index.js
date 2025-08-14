require('dotenv').config();
const app = require('./app');
const http = require('http');
const { initSocket } = require('./src/services/realtimeService');
const platformRoutes = require('./src/api/platforms');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with data aggregation service
const { io, dataService } = initSocket(server);

// Inject data service into platform routes
platformRoutes.setDataService(dataService);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Real-time analytics available via Socket.IO`);
  console.log(`🌐 API endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Sentiment: http://localhost:${PORT}/api/sentiment/analyze`);
  console.log(`   - Platforms: http://localhost:${PORT}/api/platforms`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await dataService.stopAllStreams();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await dataService.stopAllStreams();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});