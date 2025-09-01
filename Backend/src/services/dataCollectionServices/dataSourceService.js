const YoutubeDataCollectionService = require('./youtubeDataCollectionService');

// Unified data format creator
function createUnifiedData(source, item) {
  switch (source) {
    case 'youtube':
      if (item.snippet.type === 'textMessageEvent') { // Live chat message
        return {
          source: 'youtube',
          id: item.id,
          timestamp: item.snippet.publishedAt,
          text: item.snippet.displayMessage,
          metadata: {
            author: item.authorDetails.displayName,
          }
        };
      } else { // Regular video comment
        return {
          source: 'youtube',
          id: item.id,
          timestamp: item.snippet.publishedAt,
          text: item.snippet.textDisplay,
          metadata: {
            author: item.snippet.authorDisplayName,
            likeCount: item.snippet.likeCount,
          }
        };
      }
    case 'twitter':
       return {
        source: 'twitter',
        id: item.id,
        timestamp: item.created_at,
        text: item.text,
        metadata: {
          author: item.author,
        }
      };
    case 'reddit':
        return {
        source: 'reddit',
        id: item.id,
        timestamp: new Date(item.created_utc * 1000).toISOString(),
        text: `${item.title} ${item.selftext}`,
         metadata: {
          author: item.author,
        }
      };
    case 'twitch':
        return {
        source: 'twitch',
        id: item.id,
        timestamp: new Date(item.timestamp).toISOString(),
        text: item.message,
        metadata: {
          username: item.username,
        }
      };
    case 'discord':
        return {
        source: 'discord',
        id: item.id,
        timestamp: item.timestamp,
        text: item.content,
        metadata: {
          author: item.author.username,
        }
      };
    default:
      return item;
  }
}


// Service to handle data collection from various sources
class DataSourceService {
  constructor() {
    this.sources = {
      youtube: new YoutubeDataCollectionService(process.env.YOUTUBE_API_KEY),
      twitter: new TwitterService(),
      reddit: new RedditService(),
      // twitch: new TwitchService(),
      // discord: new DiscordService()
    };
  }

  async collectData(sourceType, sourceId, options = {}) {
    const service = this.sources[sourceType];
    if (!service) {
      throw new Error(`Unsupported source type: ${sourceType}`);
    }
    
    return new Promise((resolve, reject) => {
      const comments = [];
      service.on('comments', (newComments) => {
        comments.push(...newComments);
      });
      service.on('error', (error) => {
        reject(error);
        service.stopCollecting();
      });
      service.on('end', () => {
        resolve(comments.map(c => createUnifiedData(sourceType, c)));
      });
      service.startCollecting(sourceId);
    });
  }

  async startRealTimeCollection(sourceType, sourceId, onDataReceived, options = {}) {
    const service = this.sources[sourceType];
    if (!service) {
      throw new Error(`Unsupported source type: ${sourceType}`);
    }

    service.on('comments', (newComments) => {
      onDataReceived(newComments.map(c => createUnifiedData(sourceType, c)));
    });

    service.on('error', (error) => {
      console.error(`Real-time ${sourceType} collection error:`, error);
    });

    service.startCollecting(sourceId);
    return { id: sourceId, type: sourceType, sourceId: sourceId };
  }

  stopRealTimeCollection(sourceType, collectionId) {
    const service = this.sources[sourceType];
    if (service && service.stopCollecting) {
      return service.stopCollecting();
    }
  }
}

// Twitter service (placeholder)
class TwitterService {
  async collectData(searchTerm, options = {}) {
    const mockTweets = [
        { id: 'mock_tw_1', text: 'Amazing product launch today! #excited', author: 'user1', created_at: new Date().toISOString() },
        { id: 'mock_tw_2', text: 'Not impressed with the new update, lots of bugs', author: 'user2', created_at: new Date().toISOString() }
    ];
    return mockTweets.map(tweet => createUnifiedData('twitter', tweet));
  }

  async startRealTimeCollection(searchTerm, onDataReceived, options = {}) {
    const intervalId = setInterval(() => {
        const mockTweet = { id: `mock_tw_${Date.now()}`, text: `Real-time tweet about ${searchTerm}`, author: 'user', created_at: new Date().toISOString() };
        onDataReceived([createUnifiedData('twitter', mockTweet)]);
    }, 10000);
    return { id: intervalId, type: 'twitter', sourceId: searchTerm };
  }

  stopRealTimeCollection(collectionId) {
    clearInterval(collectionId.id);
  }
}

// Reddit service (placeholder)
class RedditService {
    async collectData(subreddit, options = {}) {
        const mockPosts = [
            { id: 'mock_rd_1', title: 'Great discussion topic', selftext: 'This is really interesting content', author: 'redditor1', created_utc: Date.now() / 1000 },
            { id: 'mock_rd_2', title: 'Disappointing results', selftext: 'Expected much better from this', author: 'redditor2', created_utc: Date.now() / 1000 }
        ];
        return mockPosts.map(post => createUnifiedData('reddit', post));
    }

    async startRealTimeCollection(subreddit, onDataReceived, options = {}) {
        const intervalId = setInterval(() => {
            const mockPost = { id: `mock_rd_${Date.now()}`, title: `New post in ${subreddit}`, selftext: 'Mock content', author: 'user', created_utc: Date.now() / 1000 };
            onDataReceived([createUnifiedData('reddit', mockPost)]);
        }, 15000);
        return { id: intervalId, type: 'reddit', sourceId: subreddit };
    }

    stopRealTimeCollection(collectionId) {
        clearInterval(collectionId.id);
    }
}

module.exports = { DataSourceService };