const { google } = require('googleapis');
const EventEmitter = require('events');

class YouTubeService extends EventEmitter {
  constructor() {
    super();
    this.youtube = null;
    this.activeStreams = new Map();
    this.isConfigured = false;
    
    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      
      if (apiKey) {
        this.youtube = google.youtube({
          version: 'v3',
          auth: apiKey
        });
        this.isConfigured = true;
        console.log('YouTube service configured successfully');
      } else {
        console.log('YouTube API key not configured - YouTube service will be disabled');
      }
    } catch (error) {
      console.error('Error initializing YouTube client:', error.message);
      this.isConfigured = false;
    }
  }

  // Check if service is configured
  checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('YouTube service is not configured. Please provide a valid API key.');
    }
  }

  // Start monitoring YouTube comments for a video
  async startCommentStream(videoId, interval = 30000) {
    this.checkConfiguration();
    
    if (this.activeStreams.has(videoId)) {
      throw new Error(`Stream already active for video: ${videoId}`);
    }

    const streamInfo = {
      videoId,
      interval,
      lastCommentId: null,
      intervalId: null
    };

    try {
      // Get initial comments
      await this.fetchComments(videoId);

      // Set up polling interval
      streamInfo.intervalId = setInterval(() => {
        this.fetchComments(videoId);
      }, interval);

      this.activeStreams.set(videoId, streamInfo);
      
      this.emit('streamStarted', { platform: 'youtube', videoId });
      return { success: true, videoId };
    } catch (error) {
      console.error('Error starting YouTube stream:', error);
      throw error;
    }
  }

  // Fetch comments from a YouTube video
  async fetchComments(videoId) {
    try {
      this.checkConfiguration();
      
      const response = await this.youtube.commentThreads.list({
        part: 'snippet',
        videoId: videoId,
        order: 'time',
        maxResults: 50
      });

      const comments = response.data.items.map(item => ({
        id: item.id,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        timestamp: new Date(item.snippet.topLevelComment.snippet.publishedAt),
        platform: 'youtube',
        videoId: videoId,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
        metadata: {
          channelId: item.snippet.topLevelComment.snippet.authorChannelId?.value,
          canReply: item.snippet.canReply
        }
      }));

      // Emit new comments
      for (const comment of comments) {
        this.emit('newData', comment);
      }

      return comments;
    } catch (error) {
      console.error('Error fetching YouTube comments:', error);
      this.emit('error', { platform: 'youtube', error: error.message });
      return [];
    }
  }

  // Get video information
  async getVideoInfo(videoId) {
    try {
      this.checkConfiguration();
      
      const response = await this.youtube.videos.list({
        part: 'snippet,statistics',
        id: videoId
      });

      if (response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      return {
        id: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount
      };
    } catch (error) {
      console.error('Error getting video info:', error);
      throw error;
    }
  }

  // Stop monitoring a video
  stopCommentStream(videoId) {
    const streamInfo = this.activeStreams.get(videoId);
    if (streamInfo) {
      clearInterval(streamInfo.intervalId);
      this.activeStreams.delete(videoId);
      this.emit('streamStopped', { platform: 'youtube', videoId });
      return { success: true, videoId };
    }
    return { success: false, message: 'Stream not found' };
  }

  // Stop all streams
  stopAllStreams() {
    for (const [videoId] of this.activeStreams) {
      this.stopCommentStream(videoId);
    }
  }

  // Get active streams
  getActiveStreams() {
    return Array.from(this.activeStreams.keys());
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      activeStreams: this.activeStreams.size
    };
  }
}

module.exports = YouTubeService;