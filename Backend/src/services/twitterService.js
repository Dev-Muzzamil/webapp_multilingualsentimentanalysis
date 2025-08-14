const { TwitterApi } = require('twitter-api-v2');
const EventEmitter = require('events');

class TwitterService extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.activeStreams = new Map();
    this.rules = new Map();
    this.isConfigured = false;
    
    this.initializeClient();
  }

  initializeClient() {
    try {
      // Check if required credentials are available
      const apiKey = process.env.TWITTER_API_KEY;
      const apiSecret = process.env.TWITTER_API_SECRET;
      const accessToken = process.env.TWITTER_ACCESS_TOKEN;
      const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

      if (apiKey && apiSecret && accessToken && accessSecret) {
        this.client = new TwitterApi({
          appKey: apiKey,
          appSecret: apiSecret,
          accessToken: accessToken,
          accessSecret: accessSecret,
        });
        this.isConfigured = true;
        console.log('Twitter service configured successfully');
      } else {
        console.log('Twitter API credentials not configured - Twitter service will be disabled');
      }
    } catch (error) {
      console.error('Error initializing Twitter client:', error.message);
      this.isConfigured = false;
    }
  }

  // Check if service is configured
  checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('Twitter service is not configured. Please provide valid API credentials.');
    }
  }

  // Start streaming tweets based on keywords
  async startKeywordStream(keywords, streamId = null) {
    try {
      this.checkConfiguration();
      
      const id = streamId || `stream_${Date.now()}`;
      
      if (this.activeStreams.has(id)) {
        throw new Error(`Stream already active with id: ${id}`);
      }

      // Add rules for filtering tweets
      const rules = keywords.map(keyword => ({
        value: keyword,
        tag: `${id}_${keyword}`
      }));

      const addedRules = await this.client.v2.updateStreamRules({
        add: rules
      });

      // Start the filtered stream
      const stream = await this.client.v2.searchStream({
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'lang', 'context_annotations'],
        'user.fields': ['username', 'public_metrics']
      });

      this.activeStreams.set(id, {
        stream,
        keywords,
        rules: addedRules.data || [],
        startTime: new Date()
      });

      // Handle incoming tweets
      stream.on('data', (tweet) => {
        const tweetData = {
          id: tweet.data.id,
          text: tweet.data.text,
          author: tweet.includes?.users?.[0]?.username || 'unknown',
          timestamp: new Date(tweet.data.created_at),
          platform: 'twitter',
          streamId: id,
          metadata: {
            authorId: tweet.data.author_id,
            language: tweet.data.lang,
            publicMetrics: tweet.data.public_metrics,
            contextAnnotations: tweet.data.context_annotations
          }
        };

        this.emit('newData', tweetData);
      });

      stream.on('error', (error) => {
        console.error('Twitter stream error:', error);
        this.emit('error', { platform: 'twitter', streamId: id, error: error.message });
      });

      this.emit('streamStarted', { platform: 'twitter', streamId: id, keywords });
      return { success: true, streamId: id, keywords };

    } catch (error) {
      console.error('Error starting Twitter stream:', error);
      throw error;
    }
  }

  // Search for recent tweets
  async searchTweets(query, maxResults = 10) {
    try {
      this.checkConfiguration();
      
      const tweets = await this.client.v2.search(query, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'lang'],
        'user.fields': ['username', 'public_metrics']
      });

      return tweets.data.data?.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        author: tweet.author_id,
        timestamp: new Date(tweet.created_at),
        platform: 'twitter',
        metadata: {
          language: tweet.lang,
          publicMetrics: tweet.public_metrics
        }
      })) || [];

    } catch (error) {
      console.error('Error searching tweets:', error);
      throw error;
    }
  }

  // Get user timeline
  async getUserTimeline(username, maxResults = 10) {
    try {
      this.checkConfiguration();
      
      const user = await this.client.v2.userByUsername(username);
      const tweets = await this.client.v2.userTimeline(user.data.id, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'lang']
      });

      return tweets.data.data?.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        author: username,
        timestamp: new Date(tweet.created_at),
        platform: 'twitter',
        metadata: {
          language: tweet.lang,
          publicMetrics: tweet.public_metrics
        }
      })) || [];

    } catch (error) {
      console.error('Error getting user timeline:', error);
      throw error;
    }
  }

  // Stop a specific stream
  async stopStream(streamId) {
    if (!this.isConfigured) {
      return { success: false, message: 'Twitter service not configured' };
    }

    const streamInfo = this.activeStreams.get(streamId);
    if (streamInfo) {
      // Close the stream
      streamInfo.stream.close();

      // Remove the rules
      if (streamInfo.rules.length > 0) {
        try {
          const ruleIds = streamInfo.rules.map(rule => rule.id);
          await this.client.v2.updateStreamRules({
            delete: { ids: ruleIds }
          });
        } catch (error) {
          console.error('Error removing Twitter rules:', error);
        }
      }

      this.activeStreams.delete(streamId);
      this.emit('streamStopped', { platform: 'twitter', streamId });
      return { success: true, streamId };
    }
    return { success: false, message: 'Stream not found' };
  }

  // Stop all streams
  async stopAllStreams() {
    if (!this.isConfigured) {
      return;
    }

    const promises = [];
    for (const [streamId] of this.activeStreams) {
      promises.push(this.stopStream(streamId));
    }
    await Promise.all(promises);
  }

  // Get active streams
  getActiveStreams() {
    const streams = [];
    for (const [id, info] of this.activeStreams) {
      streams.push({
        id,
        keywords: info.keywords,
        startTime: info.startTime
      });
    }
    return streams;
  }

  // Get current stream rules
  async getStreamRules() {
    try {
      this.checkConfiguration();
      const rules = await this.client.v2.streamRules();
      return rules.data || [];
    } catch (error) {
      console.error('Error getting stream rules:', error);
      return [];
    }
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      activeStreams: this.activeStreams.size
    };
  }
}

module.exports = TwitterService;