const { google } = require('googleapis');
const { EventEmitter } = require('events');

class YoutubeDataCollectionService extends EventEmitter {
  constructor(apiKey) {
    super();
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });
    this.isCollecting = false;
    this.pollingInterval = null;
    this.timeoutId = null;
  }

  async getVideoDetails(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: 'snippet,liveStreamingDetails',
        id: videoId,
      });
      return response.data.items[0];
    } catch (error) {
      this.emit('error', new Error(`Failed to get video details: ${error.message}`));
      return null;
    }
  }

  async getLiveChatMessages(liveChatId, pageToken) {
    try {
      const response = await this.youtube.liveChatMessages.list({
        liveChatId,
        part: 'snippet,authorDetails',
        pageToken,
      });

      const { items, nextPageToken, pollingIntervalMillis } = response.data;
      this.emit('comments', items);

      if (this.isCollecting) {
        this.pollingInterval = pollingIntervalMillis;
        this.timeoutId = setTimeout(() => this.getLiveChatMessages(liveChatId, nextPageToken), this.pollingInterval);
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to get live chat messages: ${error.message}`));
      // Stop collecting on error to avoid excessive requests
      this.stopCollecting();
    }
  }

  async getVideoComments(videoId, pageToken) {
    try {
      const response = await this.youtube.commentThreads.list({
        videoId,
        part: 'snippet',
        pageToken,
      });

      const { items, nextPageToken } = response.data;
      this.emit('comments', items.map(item => item.snippet.topLevelComment));

      if (nextPageToken && this.isCollecting) {
        // Add a delay to avoid hitting API limits too quickly
        this.timeoutId = setTimeout(() => this.getVideoComments(videoId, nextPageToken), 5000);
      } else {
        this.emit('end');
        this.stopCollecting();
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to get video comments: ${error.message}`));
      this.stopCollecting();
    }
  }

  async startCollecting(videoId) {
    if (this.isCollecting) {
      return;
    }

    this.isCollecting = true;
    const videoDetails = await this.getVideoDetails(videoId);

    if (!videoDetails) {
      this.isCollecting = false;
      return;
    }

    if (videoDetails.liveStreamingDetails && videoDetails.liveStreamingDetails.actualStartTime && !videoDetails.liveStreamingDetails.actualEndTime) {
      // Live video
      const liveChatId = videoDetails.liveStreamingDetails.activeLiveChatId;
      this.emit('live', liveChatId);
      this.getLiveChatMessages(liveChatId);
    } else {
      // Regular video
      this.emit('video');
      this.getVideoComments(videoId);
    }
  }

  stopCollecting() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isCollecting = false;
    this.emit('end');
  }
}

module.exports = YoutubeDataCollectionService;