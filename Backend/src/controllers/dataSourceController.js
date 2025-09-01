const { DataSourceService } = require('../services/dataCollectionServices/dataSourceService');
const pipeline = require('../services/pipelineService');
const { getYouTubeVideoId } = require('../utils/urlUtils');

const dataSourceService = new DataSourceService();

/**
 * Collects data from a specified source and runs it through the analysis pipeline.
 */
exports.collectAndAnalyze = async (req, res) => {
  try {
    const { sourceType, sourceId } = req.params;
    const options = req.body || {};

    if (!sourceType || !sourceId) {
      return res.status(400).json({
        success: false,
        error: 'Source type and source ID are required'
      });
    }

    // 1. Collect data from the source - returns an array of unified objects
    const dataItems = await dataSourceService.collectData(sourceType, sourceId, options);

    if (!dataItems || dataItems.length === 0) {
      return res.json({
        success: true,
        message: 'No new items to process.',
        data: []
      });
    }

    // 2. Process each item through the pipeline in parallel
    const processingPromises = dataItems.map(item => pipeline.process(item));
    const results = await Promise.all(processingPromises);

    res.json({
      success: true,
      message: `Successfully processed ${results.length} items.`,
      data: results
    });

  } catch (error) {
    console.error(`Error in collectAndAnalyze for ${req.params.sourceType}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect and analyze data',
      message: error.message
    });
  }
};

/**
 * Collects data from a YouTube video URL and runs it through the analysis pipeline.
 */
exports.collectAndAnalyzeFromUrl = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'YouTube video URL is required'
      });
    }

    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube video URL'
      });
    }

    // Use the existing collectAndAnalyze logic with the extracted videoId
    req.params.sourceType = 'youtube';
    req.params.sourceId = videoId;
    return exports.collectAndAnalyze(req, res);

  } catch (error) {
    console.error(`Error in collectAndAnalyzeFromUrl:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect and analyze data from URL',
      message: error.message
    });
  }
};


// --- The following functions are kept for frontend utility purposes ---

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

exports.getSourceStatus = async (req, res) => {
  try {
    // This would check the status of various APIs/services
    const status = {
      youtube: {
        available: !!process.env.YOUTUBE_API_KEY,
        message: process.env.YOUTUBE_API_KEY ? 'API key configured' : 'API key not configured - using mock data'
      },
      twitter: {
        available: false,
        message: 'Twitter API v2 required - not implemented'
      },
      reddit: {
        available: true,
        message: 'Using Reddit public API - no key required'
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