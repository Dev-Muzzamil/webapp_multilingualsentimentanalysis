const { DataSourceService } = require('../services/dataCollectionServices/dataSourceService');
const { pipelineManager } = require('../services/pipelineManager');
const { getYouTubeVideoId } = require('../utils/urlUtils');

const dataSourceService = new DataSourceService();

/**
 * Enhanced Data Source Controller with Concurrent Pipeline Support
 * Supports multiple simultaneous operations on different data sources
 */

/**
 * Create a new concurrent pipeline for data analysis
 */
exports.createPipeline = async (req, res) => {
  try {
    const { source, sourceId, options = {}, priority = 'normal' } = req.body;

    if (!source || !sourceId) {
      return res.status(400).json({
        success: false,
        error: 'Source type and source ID are required'
      });
    }

    // Create a new pipeline with concurrent support
    const pipelineId = await pipelineManager.createPipeline({
      source,
      sourceId,
      options,
      priority
    });

    res.json({
      success: true,
      message: `Pipeline created for ${source}:${sourceId}`,
      pipelineId,
      status: 'queued'
    });

  } catch (error) {
    console.error('Error creating pipeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create analysis pipeline',
      message: error.message
    });
  }
};

/**
 * Create multiple concurrent pipelines
 * Example: One for YouTube A, one for YouTube B, one for Twitter simultaneously
 */
exports.createMultiplePipelines = async (req, res) => {
  try {
    const { pipelines } = req.body;
    
    if (!Array.isArray(pipelines) || pipelines.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Pipelines array is required and must not be empty'
      });
    }

    const results = [];
    
    // Create all pipelines concurrently
    for (const config of pipelines) {
      try {
        if (!config.source || !config.sourceId) {
          results.push({
            source: config.source,
            sourceId: config.sourceId,
            error: 'Missing source or sourceId',
            status: 'failed'
          });
          continue;
        }

        const pipelineId = await pipelineManager.createPipeline({
          source: config.source,
          sourceId: config.sourceId,
          options: config.options || {},
          priority: config.priority || 'normal'
        });

        results.push({
          pipelineId,
          source: config.source,
          sourceId: config.sourceId,
          status: 'queued'
        });
      } catch (error) {
        console.error(`Error creating pipeline for ${config.source}:${config.sourceId}:`, error);
        results.push({
          source: config.source,
          sourceId: config.sourceId,
          error: error.message,
          status: 'failed'
        });
      }
    }

    res.json({
      success: true,
      message: `Created ${results.filter(r => r.pipelineId).length} out of ${pipelines.length} pipelines`,
      results
    });

  } catch (error) {
    console.error('Error creating multiple pipelines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create multiple pipelines',
      message: error.message
    });
  }
};

/**
 * Create pipeline from YouTube URL
 */
exports.createPipelineFromUrl = async (req, res) => {
  try {
    const { videoUrl, priority = 'normal', options = {} } = req.body;

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

    const pipelineId = await pipelineManager.createPipeline({
      source: 'youtube',
      sourceId: videoId,
      options,
      priority
    });

    res.json({
      success: true,
      message: `Pipeline created for YouTube video: ${videoId}`,
      pipelineId,
      videoId,
      status: 'queued'
    });

  } catch (error) {
    console.error('Error creating pipeline from URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pipeline from URL',
      message: error.message
    });
  }
};

/**
 * Get pipeline status
 */
exports.getPipelineStatus = async (req, res) => {
  try {
    const { pipelineId } = req.params;
    
    const pipeline = pipelineManager.getPipelineStatus(pipelineId);
    
    if (!pipeline) {
      return res.status(404).json({
        success: false,
        error: 'Pipeline not found'
      });
    }

    res.json({
      success: true,
      pipeline
    });

  } catch (error) {
    console.error('Error getting pipeline status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pipeline status',
      message: error.message
    });
  }
};

/**
 * Get all active pipelines
 */
exports.getAllPipelines = async (req, res) => {
  try {
    const pipelines = pipelineManager.getAllPipelines();
    
    res.json({
      success: true,
      pipelines,
      count: pipelines.length
    });

  } catch (error) {
    console.error('Error getting all pipelines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pipelines',
      message: error.message
    });
  }
};

/**
 * Stop a pipeline
 */
exports.stopPipeline = async (req, res) => {
  try {
    const { pipelineId } = req.params;
    
    await pipelineManager.stopPipeline(pipelineId);
    
    res.json({
      success: true,
      message: `Pipeline ${pipelineId} stopped`
    });

  } catch (error) {
    console.error('Error stopping pipeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop pipeline',
      message: error.message
    });
  }
};

/**
 * Get pipeline system metrics
 */
exports.getSystemMetrics = async (req, res) => {
  try {
    const metrics = pipelineManager.getMetrics();
    
    res.json({
      success: true,
      metrics
    });

  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system metrics',
      message: error.message
    });
  }
};

/**
 * Example endpoint showing how to run multiple concurrent pipelines
 * This demonstrates the key enhancement: multiple simultaneous operations
 */
exports.runConcurrentAnalysis = async (req, res) => {
  try {
    const { 
      youtubeVideos = [], 
      twitterQueries = [], 
      priority = 'normal' 
    } = req.body;

    const pipelineConfigs = [];

    // Add YouTube video pipelines
    youtubeVideos.forEach((videoUrl, index) => {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        pipelineConfigs.push({
          source: 'youtube',
          sourceId: videoId,
          options: { maxResults: 100 },
          priority
        });
      }
    });

    // Add Twitter query pipelines
    twitterQueries.forEach((query, index) => {
      pipelineConfigs.push({
        source: 'twitter',
        sourceId: query,
        options: { maxResults: 100 },
        priority
      });
    });

    if (pipelineConfigs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid pipeline configurations provided'
      });
    }

    // Create all pipelines concurrently
    const results = [];
    for (const config of pipelineConfigs) {
      try {
        const pipelineId = await pipelineManager.createPipeline(config);
        results.push({
          pipelineId,
          source: config.source,
          sourceId: config.sourceId,
          status: 'queued'
        });
      } catch (error) {
        results.push({
          source: config.source,
          sourceId: config.sourceId,
          error: error.message,
          status: 'failed'
        });
      }
    }

    res.json({
      success: true,
      message: `Started ${results.filter(r => r.pipelineId).length} concurrent analysis pipelines`,
      pipelines: results,
      note: 'All pipelines will run simultaneously without blocking each other'
    });

  } catch (error) {
    console.error('Error running concurrent analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start concurrent analysis',
      message: error.message
    });
  }
};

/**
 * Get supported sources with enhanced concurrent capabilities
 */
exports.getSupportedSources = async (req, res) => {
  try {
    const sources = [
      {
        type: 'youtube',
        name: 'YouTube',
        description: 'Collect comments from YouTube videos',
        requiredParams: ['videoId'],
        optionalParams: ['maxResults', 'priority'],
        realTimeSupported: true,
        concurrentSupported: true,
        maxConcurrent: 10
      },
      {
        type: 'twitter',
        name: 'Twitter',
        description: 'Collect tweets and replies',
        requiredParams: ['query'],
        optionalParams: ['maxResults', 'priority'],
        realTimeSupported: true,
        concurrentSupported: true,
        maxConcurrent: 10
      }
    ];

    res.json({
      success: true,
      sources,
      systemCapabilities: {
        maxConcurrentPipelines: pipelineManager.maxConcurrentPipelines,
        currentRunning: pipelineManager.runningCount,
        queueSupported: true,
        prioritySupported: true
      }
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

module.exports = exports;