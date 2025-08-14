const { DataSourceService } = require('../services/dataSourceService');

const dataSourceService = new DataSourceService();

exports.collectData = async (req, res) => {
  try {
    const { sourceType, sourceId } = req.params;
    const options = req.body || {};

    if (!sourceType || !sourceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Source type and source ID are required' 
      });
    }

    const data = await dataSourceService.collectData(sourceType, sourceId, options);
    
    res.json({
      success: true,
      data,
      sourceType,
      sourceId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error collecting data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to collect data from source',
      message: error.message
    });
  }
};

exports.getSupportedSources = async (req, res) => {
  try {
    const sources = [
      {
        type: 'youtube',
        name: 'YouTube',
        description: 'Collect comments from YouTube videos',
        requiredParams: ['videoId'],
        optionalParams: ['maxResults'],
        realTimeSupported: true
      },
      {
        type: 'twitter',
        name: 'Twitter',
        description: 'Collect tweets based on search terms or user handles',
        requiredParams: ['searchTerm'],
        optionalParams: ['count', 'resultType'],
        realTimeSupported: true
      },
      {
        type: 'reddit',
        name: 'Reddit',
        description: 'Collect posts and comments from subreddits',
        requiredParams: ['subreddit'],
        optionalParams: ['limit', 'sort'],
        realTimeSupported: true
      },
      {
        type: 'twitch',
        name: 'Twitch',
        description: 'Collect chat messages from Twitch streams',
        requiredParams: ['channelName'],
        optionalParams: ['duration'],
        realTimeSupported: true
      },
      {
        type: 'discord',
        name: 'Discord',
        description: 'Collect messages from Discord servers/channels',
        requiredParams: ['serverId'],
        optionalParams: ['channelId', 'limit'],
        realTimeSupported: true
      }
    ];

    res.json({
      success: true,
      data: sources
    });
  } catch (error) {
    console.error('Error getting supported sources:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get supported sources',
      message: error.message
    });
  }
};

exports.validateSource = async (req, res) => {
  try {
    const { sourceType, sourceId } = req.params;

    if (!sourceType || !sourceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Source type and source ID are required' 
      });
    }

    // Basic validation logic
    let isValid = false;
    let message = '';

    switch (sourceType) {
      case 'youtube':
        // Basic YouTube video ID validation
        isValid = /^[a-zA-Z0-9_-]{11}$/.test(sourceId);
        message = isValid ? 'Valid YouTube video ID' : 'Invalid YouTube video ID format';
        break;
      
      case 'twitter':
        // Basic Twitter search term validation
        isValid = sourceId.length > 0 && sourceId.length <= 500;
        message = isValid ? 'Valid Twitter search term' : 'Invalid Twitter search term';
        break;
      
      case 'reddit':
        // Basic subreddit name validation
        isValid = /^[a-zA-Z0-9_]{1,20}$/.test(sourceId);
        message = isValid ? 'Valid subreddit name' : 'Invalid subreddit name format';
        break;
      
      case 'twitch':
        // Basic Twitch channel name validation
        isValid = /^[a-zA-Z0-9_]{4,25}$/.test(sourceId);
        message = isValid ? 'Valid Twitch channel name' : 'Invalid Twitch channel name format';
        break;
      
      case 'discord':
        // Basic Discord server ID validation
        isValid = /^\d{17,19}$/.test(sourceId);
        message = isValid ? 'Valid Discord server ID' : 'Invalid Discord server ID format';
        break;
      
      default:
        isValid = false;
        message = 'Unsupported source type';
    }

    res.json({
      success: true,
      data: {
        sourceType,
        sourceId,
        isValid,
        message
      }
    });
  } catch (error) {
    console.error('Error validating source:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to validate source',
      message: error.message
    });
  }
};

exports.getSourceStatus = async (req, res) => {
  try {
    // This would check the status of various APIs/services
    const status = {
      youtube: {
        available: !!process.env.YOUTUBE_API_KEY,
        message: process.env.YOUTUBE_API_KEY ? 'API key configured' : 'API key not configured - using mock data'
      },
      twitter: {
        available: !!process.env.TWITTER_API_KEY,
        message: process.env.TWITTER_API_KEY ? 'API key configured' : 'API key not configured - using mock data'
      },
      reddit: {
        available: true,
        message: 'Using Reddit public API - no key required'
      },
      twitch: {
        available: !!process.env.TWITCH_CLIENT_ID,
        message: process.env.TWITCH_CLIENT_ID ? 'Client ID configured' : 'Client ID not configured - using mock data'
      },
      discord: {
        available: !!process.env.DISCORD_BOT_TOKEN,
        message: process.env.DISCORD_BOT_TOKEN ? 'Bot token configured' : 'Bot token not configured - using mock data'
      }
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting source status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get source status',
      message: error.message
    });
  }
};

module.exports = exports;