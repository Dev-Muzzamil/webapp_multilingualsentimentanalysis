const PipelineManager = require('../services/PipelineManager');

/**
 * Enhanced Pipeline Controller with concurrent processing support
 */
class PipelineController {
  constructor() {
    this.pipelineManager = new PipelineManager({
      maxConcurrent: 10,
      maxRetries: 3,
      retryDelay: 5000
    });

    // Set up event listeners for real-time updates
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for pipeline events
   */
  setupEventListeners() {
    this.pipelineManager.on('pipelineStarted', (pipeline) => {
      console.log(`Pipeline started: ${pipeline.id} for ${pipeline.sourceType}:${pipeline.sourceId}`);
      // Emit to WebSocket clients if needed
      this.emitToClients('pipeline_started', {
        pipelineId: pipeline.id,
        sourceType: pipeline.sourceType,
        sourceId: pipeline.sourceId,
        timestamp: pipeline.startedAt
      });
    });

    this.pipelineManager.on('pipelineProgress', (pipeline, progress) => {
      // Emit progress updates to WebSocket clients
      this.emitToClients('pipeline_progress', {
        pipelineId: pipeline.id,
        progress: progress,
        timestamp: new Date()
      });
    });

    this.pipelineManager.on('pipelineCompleted', (pipeline) => {
      console.log(`Pipeline completed: ${pipeline.id}`);
      this.emitToClients('pipeline_completed', {
        pipelineId: pipeline.id,
        result: pipeline.result,
        processingTime: pipeline.processingTime,
        timestamp: pipeline.completedAt
      });
    });

    this.pipelineManager.on('pipelineFailed', (pipeline, error, template) => {
      console.error(`Pipeline failed: ${pipeline.id}`, error.message);
      this.emitToClients('pipeline_failed', {
        pipelineId: pipeline.id,
        error: error.message,
        template: template,
        timestamp: pipeline.failedAt
      });
    });

    this.pipelineManager.on('failureTemplate', (template) => {
      // Store failure template for analysis
      this.storeFailureTemplate(template);
    });
  }

  /**
   * Start a new sentiment analysis pipeline
   */
  async startPipeline(req, res) {
    try {
      const { sourceType, sourceId, options, priority } = req.body;

      // Validate required fields
      if (!sourceType || !sourceId) {
        return res.status(400).json({
          success: false,
          error: 'sourceType and sourceId are required'
        });
      }

      // Validate source type
      const supportedSources = ['youtube', 'twitter', 'reddit', 'discord', 'twitch', 'telegram'];
      if (!supportedSources.includes(sourceType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: `Unsupported source type. Supported sources: ${supportedSources.join(', ')}`
        });
      }

      // Add pipeline to manager
      const pipelineId = await this.pipelineManager.addPipeline({
        sourceType: sourceType.toLowerCase(),
        sourceId,
        options: options || {},
        priority: priority || 'normal'
      });

      res.json({
        success: true,
        pipelineId,
        message: 'Pipeline started successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error starting pipeline:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start pipeline',
        message: error.message
      });
    }
  }

  /**
   * Get pipeline status and metrics
   */
  async getPipelineStatus(req, res) {
    try {
      const status = this.pipelineManager.getStatus();
      
      res.json({
        success: true,
        status,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error getting pipeline status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pipeline status',
        message: error.message
      });
    }
  }

  /**
   * Get details for a specific pipeline
   */
  async getPipelineDetails(req, res) {
    try {
      const { pipelineId } = req.params;
      
      if (!pipelineId) {
        return res.status(400).json({
          success: false,
          error: 'Pipeline ID is required'
        });
      }

      const pipeline = this.pipelineManager.getPipelineDetails(pipelineId);
      
      if (!pipeline) {
        return res.status(404).json({
          success: false,
          error: 'Pipeline not found'
        });
      }

      res.json({
        success: true,
        pipeline,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error getting pipeline details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pipeline details',
        message: error.message
      });
    }
  }

  /**
   * Stop a running pipeline
   */
  async stopPipeline(req, res) {
    try {
      const { pipelineId } = req.params;
      
      if (!pipelineId) {
        return res.status(400).json({
          success: false,
          error: 'Pipeline ID is required'
        });
      }

      await this.pipelineManager.stopPipeline(pipelineId);

      res.json({
        success: true,
        message: 'Pipeline stopped successfully',
        pipelineId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error stopping pipeline:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: 'Failed to stop pipeline',
        message: error.message
      });
    }
  }

  /**
   * Get pipeline analytics and insights
   */
  async getPipelineAnalytics(req, res) {
    try {
      const { timeRange = '24h' } = req.query;
      const status = this.pipelineManager.getStatus();
      
      // Generate analytics based on pipeline data
      const analytics = {
        overview: {
          totalPipelines: status.completed + status.failed,
          successRate: status.completed > 0 ? 
            (status.completed / (status.completed + status.failed)) * 100 : 0,
          averageProcessingTime: status.metrics.averageProcessingTime,
          throughputPerMinute: status.metrics.throughputPerMinute
        },
        current: {
          activePipelines: status.active,
          queuedPipelines: status.queued,
          systemLoad: (status.active / 10) * 100 // Assuming max 10 concurrent
        },
        timeRange,
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error getting pipeline analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pipeline analytics',
        message: error.message
      });
    }
  }

  /**
   * Batch start multiple pipelines
   */
  async startBatchPipelines(req, res) {
    try {
      const { pipelines } = req.body;

      if (!Array.isArray(pipelines) || pipelines.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'pipelines array is required and must not be empty'
        });
      }

      const results = [];
      const errors = [];

      for (const pipelineConfig of pipelines) {
        try {
          const pipelineId = await this.pipelineManager.addPipeline(pipelineConfig);
          results.push({
            pipelineId,
            sourceType: pipelineConfig.sourceType,
            sourceId: pipelineConfig.sourceId,
            status: 'queued'
          });
        } catch (error) {
          errors.push({
            sourceType: pipelineConfig.sourceType,
            sourceId: pipelineConfig.sourceId,
            error: error.message
          });
        }
      }

      res.json({
        success: errors.length === 0,
        results,
        errors,
        summary: {
          total: pipelines.length,
          successful: results.length,
          failed: errors.length
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error starting batch pipelines:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start batch pipelines',
        message: error.message
      });
    }
  }

  /**
   * Get failure templates and patterns
   */
  async getFailureAnalysis(req, res) {
    try {
      // In a real implementation, this would query stored failure templates
      // For now, return mock analysis data
      const mockAnalysis = {
        commonPatterns: [
          {
            pattern: 'TIMEOUT_ERROR',
            frequency: 15,
            percentage: 35.7,
            recommendations: [
              'Increase timeout value in pipeline configuration',
              'Check network connectivity to data source'
            ]
          },
          {
            pattern: 'RATE_LIMIT_ERROR',
            frequency: 12,
            percentage: 28.6,
            recommendations: [
              'Implement exponential backoff for API requests',
              'Consider upgrading API plan for higher rate limits'
            ]
          },
          {
            pattern: 'AUTH_ERROR',
            frequency: 8,
            percentage: 19.0,
            recommendations: [
              'Verify API credentials are valid and not expired',
              'Check API key permissions for required endpoints'
            ]
          }
        ],
        totalFailures: 42,
        analysisTimeRange: '7d',
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        analysis: mockAnalysis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error getting failure analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get failure analysis',
        message: error.message
      });
    }
  }

  /**
   * Emit events to WebSocket clients (placeholder)
   */
  emitToClients(event, data) {
    // In a real implementation, this would emit to WebSocket clients
    // For now, just log the event
    console.log(`WebSocket Event [${event}]:`, data);
  }

  /**
   * Store failure template for analysis (placeholder)
   */
  storeFailureTemplate(template) {
    // In a real implementation, this would store to a database
    console.log('Failure template stored:', template.id);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req, res) {
    try {
      const status = this.pipelineManager.getStatus();
      const isHealthy = status.active < 10 && status.queued < 50; // Example health criteria

      res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        health: isHealthy ? 'healthy' : 'degraded',
        status,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        health: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('Shutting down Pipeline Controller...');
    await this.pipelineManager.shutdown();
    console.log('Pipeline Controller shutdown complete');
  }
}

module.exports = PipelineController;