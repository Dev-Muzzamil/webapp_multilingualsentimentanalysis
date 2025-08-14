const DataAggregationService = require('./dataAggregationService');

function initSocket(server) {
  const io = require('socket.io')(server, { 
    cors: { 
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    } 
  });

  // Initialize data aggregation service
  const dataService = new DataAggregationService();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current analytics on connection
    socket.emit('analytics', dataService.getAnalytics());
    socket.emit('activeStreams', dataService.getActiveStreams());

    // Handle platform stream requests
    socket.on('startYouTubeStream', async (data) => {
      try {
        const result = await dataService.startYouTubeStream(data.videoId, data.interval);
        socket.emit('streamStarted', { platform: 'youtube', result });
      } catch (error) {
        socket.emit('streamError', { platform: 'youtube', error: error.message });
      }
    });

    socket.on('startTwitterStream', async (data) => {
      try {
        const result = await dataService.startTwitterStream(data.keywords, data.streamId);
        socket.emit('streamStarted', { platform: 'twitter', result });
      } catch (error) {
        socket.emit('streamError', { platform: 'twitter', error: error.message });
      }
    });

    socket.on('startDiscordStream', async (data) => {
      try {
        const result = await dataService.startDiscordStream(data.channelId, data.type);
        socket.emit('streamStarted', { platform: 'discord', result });
      } catch (error) {
        socket.emit('streamError', { platform: 'discord', error: error.message });
      }
    });

    socket.on('startTwitchStream', async (data) => {
      try {
        const result = await dataService.startTwitchStream(data.channelName);
        socket.emit('streamStarted', { platform: 'twitch', result });
      } catch (error) {
        socket.emit('streamError', { platform: 'twitch', error: error.message });
      }
    });

    socket.on('stopStream', async (data) => {
      try {
        const result = await dataService.stopStream(data.platform, data.identifier);
        socket.emit('streamStopped', { platform: data.platform, result });
      } catch (error) {
        socket.emit('streamError', { platform: data.platform, error: error.message });
      }
    });

    socket.on('getAnalytics', () => {
      socket.emit('analytics', dataService.getAnalytics());
    });

    socket.on('getActiveStreams', () => {
      socket.emit('activeStreams', dataService.getActiveStreams());
    });

    socket.on('getCombinedAnalysis', async (data) => {
      try {
        const analysis = await dataService.getCombinedAnalysis(data?.timeRange);
        socket.emit('combinedAnalysis', analysis);
      } catch (error) {
        socket.emit('analysisError', { error: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Listen to data service events and broadcast to all clients
  dataService.on('rawData', (data) => {
    io.emit('newMessage', data);
  });

  dataService.on('batchProcessed', (data) => {
    io.emit('batchProcessed', data);
    io.emit('analytics', dataService.getAnalytics());
  });

  dataService.on('streamStarted', (data) => {
    io.emit('streamStarted', data);
    io.emit('activeStreams', dataService.getActiveStreams());
  });

  dataService.on('streamStopped', (data) => {
    io.emit('streamStopped', data);
    io.emit('activeStreams', dataService.getActiveStreams());
  });

  dataService.on('error', (error) => {
    io.emit('serviceError', error);
  });

  return { io, dataService };
}

module.exports = { initSocket };