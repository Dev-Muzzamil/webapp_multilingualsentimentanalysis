const express = require('express');
const router = express.Router();
const enhancedDataSourceController = require('../controllers/enhancedDataSourceController');
const { enhancedAnalyticsService } = require('../services/enhancedAnalyticsService');
const { pipelineManager } = require('../services/pipelineManager');

/**
 * Enhanced Routes for Concurrent Pipeline Management
 * Supports multiple simultaneous operations and advanced analytics
 */

// =============================================================================
// CONCURRENT PIPELINE ROUTES
// =============================================================================

/**
 * Create a single pipeline
 * POST /api/enhanced/pipeline
 */
router.post('/pipeline', enhancedDataSourceController.createPipeline);

/**
 * Create multiple concurrent pipelines
 * POST /api/enhanced/pipelines/batch
 * Body: { pipelines: [{ source, sourceId, options, priority }, ...] }
 */
router.post('/pipelines/batch', enhancedDataSourceController.createMultiplePipelines);

/**
 * Create pipeline from URL (YouTube, Twitter, etc.)
 * POST /api/enhanced/pipeline/url
 */
router.post('/pipeline/url', enhancedDataSourceController.createPipelineFromUrl);

/**
 * Concurrent analysis example endpoint
 * POST /api/enhanced/concurrent-analysis
 * Body: { youtubeVideos: [], twitterQueries: [], priority: 'normal' }
 */
router.post('/concurrent-analysis', enhancedDataSourceController.runConcurrentAnalysis);

// =============================================================================
// PIPELINE MANAGEMENT ROUTES
// =============================================================================

/**
 * Get pipeline status
 * GET /api/enhanced/pipeline/:pipelineId
 */
router.get('/pipeline/:pipelineId', enhancedDataSourceController.getPipelineStatus);

/**
 * Stop a pipeline
 * DELETE /api/enhanced/pipeline/:pipelineId
 */
router.delete('/pipeline/:pipelineId', enhancedDataSourceController.stopPipeline);

/**
 * Get all active pipelines
 * GET /api/enhanced/pipelines
 */
router.get('/pipelines', enhancedDataSourceController.getAllPipelines);

// =============================================================================
// ANALYTICS AND METRICS ROUTES
// =============================================================================

/**
 * Get system metrics
 * GET /api/enhanced/metrics
 */
router.get('/metrics', enhancedDataSourceController.getSystemMetrics);

/**
 * Get comprehensive dashboard analytics
 * GET /api/enhanced/analytics/dashboard?timeRange=day|week|month
 */
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const { timeRange = 'day' } = req.query;
    const analytics = await enhancedAnalyticsService.getDashboardAnalytics(timeRange);
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics',
      message: error.message
    });
  }
});

/**
 * Get real-time statistics
 * GET /api/enhanced/analytics/realtime
 */
router.get('/analytics/realtime', async (req, res) => {
  try {
    const stats = enhancedAnalyticsService.getRealTimeStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting real-time stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get real-time stats',
      message: error.message
    });
  }
});

/**
 * Get performance insights and recommendations
 * GET /api/enhanced/analytics/insights
 */
router.get('/analytics/insights', async (req, res) => {
  try {
    const insights = enhancedAnalyticsService.getPerformanceInsights();
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Error getting performance insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get insights',
      message: error.message
    });
  }
});

/**
 * Get usage patterns
 * GET /api/enhanced/analytics/usage-patterns
 */
router.get('/analytics/usage-patterns', async (req, res) => {
  try {
    const patterns = await enhancedAnalyticsService.getUsagePatterns();
    
    res.json({
      success: true,
      patterns
    });
  } catch (error) {
    console.error('Error getting usage patterns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get usage patterns',
      message: error.message
    });
  }
});

// =============================================================================
// PIPELINE HEALTH AND STATUS ROUTES
// =============================================================================

/**
 * Get system health status
 * GET /api/enhanced/health
 */
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      pipeline: {
        active: pipelineManager.activePipelines.size,
        running: pipelineManager.runningCount,
        queued: pipelineManager.pipelineQueue.length,
        maxConcurrent: pipelineManager.maxConcurrentPipelines
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      performance: enhancedAnalyticsService.getRealTimeStats().performance
    };

    // Determine overall health status
    if (pipelineManager.runningCount >= pipelineManager.maxConcurrentPipelines) {
      health.status = 'busy';
    }
    
    if (health.performance.successRate < 0.8) {
      health.status = 'degraded';
    }

    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('Error getting health status:', error);
    res.status(500).json({
      success: false,
      health: {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * Get pipeline queue status
 * GET /api/enhanced/queue
 */
router.get('/queue', async (req, res) => {
  try {
    const queueStatus = {
      length: pipelineManager.pipelineQueue.length,
      running: pipelineManager.runningCount,
      maxConcurrent: pipelineManager.maxConcurrentPipelines,
      availableSlots: pipelineManager.maxConcurrentPipelines - pipelineManager.runningCount,
      queue: pipelineManager.pipelineQueue.map(pipelineId => {
        const pipeline = pipelineManager.getPipelineStatus(pipelineId);
        return {
          pipelineId,
          source: pipeline?.source,
          sourceId: pipeline?.sourceId,
          priority: pipeline?.priority,
          queuedAt: pipeline?.createdAt
        };
      })
    };

    res.json({
      success: true,
      queueStatus
    });
  } catch (error) {
    console.error('Error getting queue status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get queue status',
      message: error.message
    });
  }
});

// =============================================================================
// CONFIGURATION AND UTILITY ROUTES
// =============================================================================

/**
 * Get supported sources with enhanced capabilities
 * GET /api/enhanced/sources
 */
router.get('/sources', enhancedDataSourceController.getSupportedSources);

/**
 * Update pipeline configuration
 * PUT /api/enhanced/config
 */
router.put('/config', async (req, res) => {
  try {
    const { maxConcurrentPipelines } = req.body;
    
    if (maxConcurrentPipelines && maxConcurrentPipelines > 0) {
      pipelineManager.maxConcurrentPipelines = parseInt(maxConcurrentPipelines);
      
      // Try to process more pipelines if limit increased
      pipelineManager._processQueue();
    }

    res.json({
      success: true,
      message: 'Configuration updated',
      config: {
        maxConcurrentPipelines: pipelineManager.maxConcurrentPipelines
      }
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration',
      message: error.message
    });
  }
});

// =============================================================================
// WEBSOCKET EVENT HANDLING
// =============================================================================

/**
 * Setup WebSocket event handlers for real-time updates
 */
function setupWebSocketEvents() {
  pipelineManager.on('pipelineCreated', (data) => {
    if (global.io) {
      global.io.emit('pipelineCreated', data);
    }
  });

  pipelineManager.on('pipelineStarted', (data) => {
    if (global.io) {
      global.io.emit('pipelineStarted', data);
    }
  });

  pipelineManager.on('pipelineProgress', (data) => {
    if (global.io) {
      global.io.emit('pipelineProgress', data);
    }
  });

  pipelineManager.on('pipelineCompleted', (data) => {
    if (global.io) {
      global.io.emit('pipelineCompleted', data);
    }
  });

  pipelineManager.on('pipelineError', (data) => {
    if (global.io) {
      global.io.emit('pipelineError', data);
    }
  });
}

// Initialize WebSocket events
setupWebSocketEvents();

module.exports = router;