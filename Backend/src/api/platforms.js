const express = require('express');
const router = express.Router();

// This will be injected by the main app
let dataService = null;

// Middleware to ensure data service is available
const ensureDataService = (req, res, next) => {
  if (!dataService) {
    return res.status(503).json({ error: 'Data service not available' });
  }
  next();
};

// Set data service (called from app.js)
router.setDataService = (service) => {
  dataService = service;
};

// Get all active streams
router.get('/streams', ensureDataService, (req, res) => {
  try {
    const streams = dataService.getActiveStreams();
    res.json({ streams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics', ensureDataService, (req, res) => {
  try {
    const analytics = dataService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get combined analysis
router.get('/analysis', ensureDataService, async (req, res) => {
  try {
    const timeRange = req.query.timeRange ? parseInt(req.query.timeRange) : undefined;
    const analysis = await dataService.getCombinedAnalysis(timeRange);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start YouTube stream
router.post('/streams/youtube', ensureDataService, async (req, res) => {
  try {
    const { videoId, interval } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'videoId is required' });
    }

    const result = await dataService.startYouTubeStream(videoId, interval);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Twitter stream
router.post('/streams/twitter', ensureDataService, async (req, res) => {
  try {
    const { keywords, streamId } = req.body;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'keywords array is required' });
    }

    const result = await dataService.startTwitterStream(keywords, streamId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Discord stream
router.post('/streams/discord', ensureDataService, async (req, res) => {
  try {
    const { channelId, type = 'channel' } = req.body;
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }

    const result = await dataService.startDiscordStream(channelId, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Twitch stream
router.post('/streams/twitch', ensureDataService, async (req, res) => {
  try {
    const { channelName } = req.body;
    if (!channelName) {
      return res.status(400).json({ error: 'channelName is required' });
    }

    const result = await dataService.startTwitchStream(channelName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop a specific stream
router.delete('/streams/:platform/:identifier', ensureDataService, async (req, res) => {
  try {
    const { platform, identifier } = req.params;
    const result = await dataService.stopStream(platform, identifier);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop all streams
router.delete('/streams', ensureDataService, async (req, res) => {
  try {
    await dataService.stopAllStreams();
    res.json({ success: true, message: 'All streams stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get YouTube video info
router.get('/youtube/video/:videoId', ensureDataService, async (req, res) => {
  try {
    const { videoId } = req.params;
    const info = await dataService.youtube.getVideoInfo(videoId);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Twitter
router.get('/twitter/search', ensureDataService, async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const tweets = await dataService.twitter.searchTweets(query, parseInt(maxResults));
    res.json({ tweets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Discord guilds
router.get('/discord/guilds', ensureDataService, async (req, res) => {
  try {
    const guilds = await dataService.discord.getGuilds();
    res.json({ guilds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Discord channels for a guild
router.get('/discord/guilds/:guildId/channels', ensureDataService, async (req, res) => {
  try {
    const { guildId } = req.params;
    const channels = await dataService.discord.getGuildChannels(guildId);
    res.json({ channels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Twitch stream info
router.get('/twitch/stream/:channelName', ensureDataService, async (req, res) => {
  try {
    const { channelName } = req.params;
    const info = await dataService.twitch.getStreamInfo(channelName);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported languages for translation
router.get('/languages', async (req, res) => {
  try {
    const { getSupportedLanguages } = require('../services/translationService');
    const languages = await getSupportedLanguages();
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;