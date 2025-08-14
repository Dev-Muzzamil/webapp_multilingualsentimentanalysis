const EventEmitter = require('events');
const YouTubeService = require('./youtubeService');
const TwitterService = require('./twitterService');
const DiscordService = require('./discordService');
const TwitchService = require('./twitchService');
const { detectLanguage } = require('./languageDetectionService');
const { translateText } = require('./translationService');
const { preprocessSocialMedia } = require('./preprocessingService');
const { analyzeSentiment } = require('./sentimentService');
const { saveResult } = require('./dbService');

class DataAggregationService extends EventEmitter {
  constructor() {
    super();
    this.youtube = new YouTubeService();
    this.twitter = new TwitterService();
    this.discord = new DiscordService();
    this.twitch = new TwitchService();
    
    this.activeStreams = new Map();
    this.analysisBuffer = [];
    this.bufferSize = 100;
    this.processInterval = 5000; // Process every 5 seconds
    this.processingTimer = null;
    
    this.setupEventListeners();
    this.startProcessing();
  }

  // Setup event listeners for all platforms
  setupEventListeners() {
    // YouTube events
    this.youtube.on('newData', (data) => this.handleNewData(data));
    this.youtube.on('error', (error) => this.emit('error', error));
    this.youtube.on('streamStarted', (info) => this.handleStreamStarted(info));
    this.youtube.on('streamStopped', (info) => this.handleStreamStopped(info));

    // Twitter events
    this.twitter.on('newData', (data) => this.handleNewData(data));
    this.twitter.on('error', (error) => this.emit('error', error));
    this.twitter.on('streamStarted', (info) => this.handleStreamStarted(info));
    this.twitter.on('streamStopped', (info) => this.handleStreamStopped(info));

    // Discord events
    this.discord.on('newData', (data) => this.handleNewData(data));
    this.discord.on('error', (error) => this.emit('error', error));
    this.discord.on('streamStarted', (info) => this.handleStreamStarted(info));
    this.discord.on('streamStopped', (info) => this.handleStreamStopped(info));

    // Twitch events
    this.twitch.on('newData', (data) => this.handleNewData(data));
    this.twitch.on('error', (error) => this.emit('error', error));
    this.twitch.on('streamStarted', (info) => this.handleStreamStarted(info));
    this.twitch.on('streamStopped', (info) => this.handleStreamStopped(info));
  }

  // Handle new data from any platform
  async handleNewData(data) {
    try {
      // Add to buffer for batch processing
      this.analysisBuffer.push({
        ...data,
        receivedAt: new Date()
      });

      // Emit raw data immediately for real-time display
      this.emit('rawData', data);

      // Process immediately if buffer is full
      if (this.analysisBuffer.length >= this.bufferSize) {
        await this.processBuffer();
      }

    } catch (error) {
      console.error('Error handling new data:', error);
      this.emit('error', { message: 'Error processing data', error: error.message });
    }
  }

  // Handle stream started events
  handleStreamStarted(info) {
    const streamKey = `${info.platform}_${info.streamId || info.videoId || info.channelId || info.guildId || Date.now()}`;
    this.activeStreams.set(streamKey, {
      ...info,
      startedAt: new Date(),
      messageCount: 0
    });
    
    this.emit('streamStarted', { streamKey, ...info });
  }

  // Handle stream stopped events
  handleStreamStopped(info) {
    const streamKey = `${info.platform}_${info.streamId || info.videoId || info.channelId || info.guildId}`;
    const streamInfo = this.activeStreams.get(streamKey);
    
    if (streamInfo) {
      this.activeStreams.delete(streamKey);
      this.emit('streamStopped', { 
        streamKey, 
        ...info, 
        duration: Date.now() - streamInfo.startedAt.getTime(),
        messageCount: streamInfo.messageCount 
      });
    }
  }

  // Start processing buffer periodically
  startProcessing() {
    this.processingTimer = setInterval(() => {
      if (this.analysisBuffer.length > 0) {
        this.processBuffer();
      }
    }, this.processInterval);
  }

  // Process buffer of messages
  async processBuffer() {
    if (this.analysisBuffer.length === 0) return;

    const batch = this.analysisBuffer.splice(0, this.bufferSize);
    
    try {
      // Process each message in the batch
      const analysisPromises = batch.map(data => this.analyzeSingleMessage(data));
      const analysisResults = await Promise.allSettled(analysisPromises);

      // Collect successful results
      const successfulResults = analysisResults
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      // Save to database
      if (successfulResults.length > 0) {
        await this.saveBatchResults(successfulResults);
      }

      // Emit processed data
      this.emit('batchProcessed', {
        total: batch.length,
        successful: successfulResults.length,
        failed: batch.length - successfulResults.length,
        results: successfulResults
      });

      // Update stream message counts
      batch.forEach(data => {
        const streamKey = `${data.platform}_${data.streamId || data.videoId || data.channelId || data.guildId}`;
        const streamInfo = this.activeStreams.get(streamKey);
        if (streamInfo) {
          streamInfo.messageCount++;
        }
      });

    } catch (error) {
      console.error('Error processing buffer:', error);
      this.emit('error', { message: 'Error processing message batch', error: error.message });
    }
  }

  // Analyze a single message
  async analyzeSingleMessage(data) {
    try {
      // Step 1: Preprocess text based on platform
      const preprocessedText = preprocessSocialMedia(data.text, data.platform);

      // Step 2: Detect language
      const detectedLanguage = await detectLanguage(preprocessedText);

      // Step 3: Translate if not English
      let translation = null;
      let textForAnalysis = preprocessedText;
      
      if (detectedLanguage !== 'en' && preprocessedText.trim()) {
        translation = await translateText(preprocessedText, 'en', detectedLanguage);
        textForAnalysis = translation;
      }

      // Step 4: Perform sentiment analysis
      const sentimentResult = await analyzeSentiment(textForAnalysis, detectedLanguage);

      // Step 5: Create analysis result
      const analysisResult = {
        id: data.id,
        platform: data.platform,
        originalText: data.text,
        preprocessedText,
        translatedText: translation,
        detectedLanguage,
        sentiment: sentimentResult,
        author: data.author,
        timestamp: data.timestamp,
        metadata: data.metadata,
        analysisTimestamp: new Date()
      };

      return analysisResult;

    } catch (error) {
      console.error('Error analyzing message:', error);
      throw error;
    }
  }

  // Save batch results to database
  async saveBatchResults(results) {
    try {
      const savePromises = results.map(result => saveResult(result));
      await Promise.allSettled(savePromises);
    } catch (error) {
      console.error('Error saving batch results:', error);
      throw error;
    }
  }

  // Start YouTube stream
  async startYouTubeStream(videoId, interval = 30000) {
    return await this.youtube.startCommentStream(videoId, interval);
  }

  // Start Twitter stream
  async startTwitterStream(keywords, streamId = null) {
    return await this.twitter.startKeywordStream(keywords, streamId);
  }

  // Start Discord monitoring
  async startDiscordStream(channelId, type = 'channel') {
    if (type === 'channel') {
      return await this.discord.startChannelMonitoring(channelId);
    } else {
      return await this.discord.startGuildMonitoring(channelId);
    }
  }

  // Start Twitch stream
  async startTwitchStream(channelName) {
    return await this.twitch.joinChannel(channelName);
  }

  // Stop specific stream
  async stopStream(platform, identifier) {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return this.youtube.stopCommentStream(identifier);
      case 'twitter':
        return await this.twitter.stopStream(identifier);
      case 'discord':
        return this.discord.stopChannelMonitoring(identifier);
      case 'twitch':
        return this.twitch.leaveChannel(identifier);
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  // Get analytics for all active streams
  getAnalytics() {
    const analytics = {
      totalStreams: this.activeStreams.size,
      streamsByPlatform: {},
      totalMessages: 0,
      bufferSize: this.analysisBuffer.length
    };

    // Calculate analytics by platform
    for (const [streamKey, streamInfo] of this.activeStreams) {
      const platform = streamInfo.platform;
      if (!analytics.streamsByPlatform[platform]) {
        analytics.streamsByPlatform[platform] = {
          count: 0,
          messages: 0
        };
      }
      
      analytics.streamsByPlatform[platform].count++;
      analytics.streamsByPlatform[platform].messages += streamInfo.messageCount;
      analytics.totalMessages += streamInfo.messageCount;
    }

    return analytics;
  }

  // Get all active streams
  getActiveStreams() {
    return Array.from(this.activeStreams.entries()).map(([key, info]) => ({
      key,
      ...info
    }));
  }

  // Stop all streams
  async stopAllStreams() {
    // Stop processing
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
    }

    // Process remaining buffer
    if (this.analysisBuffer.length > 0) {
      await this.processBuffer();
    }

    // Stop all platform streams
    this.youtube.stopAllStreams();
    await this.twitter.stopAllStreams();
    this.discord.stopAllMonitoring();
    this.twitch.disconnect();

    this.activeStreams.clear();
    this.emit('allStreamsStopped');
  }

  // Get combined sentiment analysis for all platforms
  async getCombinedAnalysis(timeRange = 3600000) { // Default 1 hour
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - timeRange);

      // This would typically query the database for results in the time range
      // For now, we'll return a summary of current active streams
      const analytics = this.getAnalytics();
      
      return {
        timeRange: { start: startTime, end: endTime },
        analytics,
        activeStreams: this.getActiveStreams()
      };

    } catch (error) {
      console.error('Error getting combined analysis:', error);
      throw error;
    }
  }
}

module.exports = DataAggregationService;