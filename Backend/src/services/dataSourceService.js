const axios = require('axios');

// Service to handle data collection from various sources
class DataSourceService {
  constructor() {
    this.sources = {
      youtube: new YouTubeService(),
      twitter: new TwitterService(),
      reddit: new RedditService(),
      twitch: new TwitchService(),
      discord: new DiscordService()
    };
  }

  async collectData(sourceType, sourceId, options = {}) {
    const service = this.sources[sourceType];
    if (!service) {
      throw new Error(`Unsupported source type: ${sourceType}`);
    }

    return await service.collectData(sourceId, options);
  }

  async startRealTimeCollection(sourceType, sourceId, callback, options = {}) {
    const service = this.sources[sourceType];
    if (!service) {
      throw new Error(`Unsupported source type: ${sourceType}`);
    }

    return await service.startRealTimeCollection(sourceId, callback, options);
  }

  stopRealTimeCollection(sourceType, collectionId) {
    const service = this.sources[sourceType];
    if (service && service.stopRealTimeCollection) {
      return service.stopRealTimeCollection(collectionId);
    }
  }
}

// YouTube data collection service
class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
  }

  async collectData(videoId, options = {}) {
    try {
      const comments = await this.getComments(videoId, options.maxResults || 100);
      const videoInfo = await this.getVideoInfo(videoId);
      
      return {
        source: 'youtube',
        sourceId: videoId,
        videoInfo,
        comments,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('YouTube data collection error:', error.message);
      return { source: 'youtube', sourceId: videoId, error: error.message, comments: [] };
    }
  }

  async getComments(videoId, maxResults = 100) {
    if (!this.apiKey) {
      // Return mock data for testing
      return this.getMockComments(videoId);
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
        params: {
          part: 'snippet',
          videoId: videoId,
          key: this.apiKey,
          maxResults: Math.min(maxResults, 100)
        }
      });

      return response.data.items.map(item => ({
        id: item.id,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        likeCount: item.snippet.topLevelComment.snippet.likeCount
      }));
    } catch (error) {
      console.error('YouTube API error:', error.message);
      return this.getMockComments(videoId);
    }
  }

  async getVideoInfo(videoId) {
    if (!this.apiKey) {
      return { id: videoId, title: 'Sample Video', description: 'Sample description' };
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: this.apiKey
        }
      });

      const video = response.data.items[0];
      return {
        id: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount
      };
    } catch (error) {
      console.error('YouTube video info error:', error.message);
      return { id: videoId, title: 'Sample Video', description: 'Sample description' };
    }
  }

  getMockComments(videoId) {
    return [
      { id: '1', text: 'Great video! I really enjoyed this content.', author: 'User1', publishedAt: new Date().toISOString(), likeCount: 5 },
      { id: '2', text: 'This is terrible, I hate it.', author: 'User2', publishedAt: new Date().toISOString(), likeCount: 0 },
      { id: '3', text: 'Interesting perspective, thanks for sharing.', author: 'User3', publishedAt: new Date().toISOString(), likeCount: 3 },
      { id: '4', text: 'Could be better, but not bad overall.', author: 'User4', publishedAt: new Date().toISOString(), likeCount: 1 }
    ];
  }

  async startRealTimeCollection(videoId, callback, options = {}) {
    // For YouTube, we'll simulate real-time by polling comments
    const pollInterval = options.pollInterval || 30000; // 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const newComments = await this.getComments(videoId, 10);
        callback({ source: 'youtube', sourceId: videoId, data: newComments });
      } catch (error) {
        console.error('Real-time YouTube collection error:', error);
      }
    }, pollInterval);

    return { id: intervalId, type: 'youtube', sourceId: videoId };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

// Twitter service (placeholder - would need Twitter API v2)
class TwitterService {
  async collectData(searchTerm, options = {}) {
    // Mock implementation
    return {
      source: 'twitter',
      sourceId: searchTerm,
      tweets: [
        { id: '1', text: 'Amazing product launch today! #excited', author: 'user1', created_at: new Date().toISOString() },
        { id: '2', text: 'Not impressed with the new update, lots of bugs', author: 'user2', created_at: new Date().toISOString() }
      ],
      timestamp: new Date().toISOString()
    };
  }

  async startRealTimeCollection(searchTerm, callback, options = {}) {
    // Mock real-time collection
    const intervalId = setInterval(() => {
      callback({
        source: 'twitter',
        sourceId: searchTerm,
        data: [{ id: Date.now(), text: `Real-time tweet about ${searchTerm}`, author: 'user', created_at: new Date().toISOString() }]
      });
    }, 10000);

    return { id: intervalId, type: 'twitter', sourceId: searchTerm };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

// Reddit service (placeholder)
class RedditService {
  async collectData(subredditOrPost, options = {}) {
    return {
      source: 'reddit',
      sourceId: subredditOrPost,
      posts: [
        { id: '1', title: 'Great discussion topic', selftext: 'This is really interesting content', author: 'redditor1', created_utc: Date.now() / 1000 },
        { id: '2', title: 'Disappointing results', selftext: 'Expected much better from this', author: 'redditor2', created_utc: Date.now() / 1000 }
      ],
      timestamp: new Date().toISOString()
    };
  }

  async startRealTimeCollection(subreddit, callback, options = {}) {
    const intervalId = setInterval(() => {
      callback({
        source: 'reddit',
        sourceId: subreddit,
        data: [{ id: Date.now(), title: `New post in ${subreddit}`, selftext: 'Mock content', author: 'user', created_utc: Date.now() / 1000 }]
      });
    }, 15000);

    return { id: intervalId, type: 'reddit', sourceId: subreddit };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

// Twitch service (placeholder)
class TwitchService {
  async collectData(channelName, options = {}) {
    return {
      source: 'twitch',
      sourceId: channelName,
      messages: [
        { id: '1', message: 'Great stream! Love this game!', username: 'viewer1', timestamp: Date.now() },
        { id: '2', message: 'This is boring, change the game', username: 'viewer2', timestamp: Date.now() }
      ],
      timestamp: new Date().toISOString()
    };
  }

  async startRealTimeCollection(channelName, callback, options = {}) {
    const intervalId = setInterval(() => {
      callback({
        source: 'twitch',
        sourceId: channelName,
        data: [{ id: Date.now(), message: `Random chat message in ${channelName}`, username: 'viewer', timestamp: Date.now() }]
      });
    }, 5000);

    return { id: intervalId, type: 'twitch', sourceId: channelName };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

// Discord service (placeholder)
class DiscordService {
  async collectData(serverId, options = {}) {
    return {
      source: 'discord',
      sourceId: serverId,
      messages: [
        { id: '1', content: 'This server is awesome!', author: { username: 'user1' }, timestamp: new Date().toISOString() },
        { id: '2', content: 'Not a fan of this topic', author: { username: 'user2' }, timestamp: new Date().toISOString() }
      ],
      timestamp: new Date().toISOString()
    };
  }

  async startRealTimeCollection(serverId, callback, options = {}) {
    const intervalId = setInterval(() => {
      callback({
        source: 'discord',
        sourceId: serverId,
        data: [{ id: Date.now(), content: `New message in server ${serverId}`, author: { username: 'user' }, timestamp: new Date().toISOString() }]
      });
    }, 8000);

    return { id: intervalId, type: 'discord', sourceId: serverId };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

module.exports = { DataSourceService };