require('dotenv').config();

const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');
const pipelineService = require('./pipelineService');
const { realTimeService } = require('./realtimeService');
const { enhancedAnalyticsService } = require('./enhancedAnalyticsService');

/**
 * Advanced Pipeline Manager for Concurrent Operations
 * Supports multiple simultaneous pipelines with different sources
 * Enhanced with comprehensive analytics and performance tracking
 */
class PipelineManager extends EventEmitter {
  constructor() {
    super();
    this.activePipelines = new Map(); // pipelineId -> pipeline info
    this.pipelineQueue = []; // Queue for pending pipelines
    this.maxConcurrentPipelines = parseInt(process.env.MAX_CONCURRENT_PIPELINES) || 10;
    this.runningCount = 0;
    this.metrics = {
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      avgProcessingTime: 0,
      pipelineHistory: []
    };
  }

  /**
   * Create and start a new pipeline
   * @param {object} config - Pipeline configuration
   * @param {string} config.source - Data source (youtube, twitter, etc.)
   * @param {string} config.sourceId - Source identifier
   * @param {object} config.options - Processing options
   * @param {string} config.priority - Priority level (high, normal, low)
   * @returns {Promise<string>} Pipeline ID
   */
  async createPipeline(config) {
    const pipelineId = uuidv4();
    const pipeline = {
      id: pipelineId,
      source: config.source,
      sourceId: config.sourceId,
      options: config.options || {},
      priority: config.priority || 'normal',
      status: 'queued',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      error: null,
      results: [],
      processedItems: 0,
      totalItems: 0
    };

    this.activePipelines.set(pipelineId, pipeline);
    this.pipelineQueue.push(pipelineId);
    
    // Sort queue by priority
    this._sortQueue();
    
    // Try to start pipeline immediately if slot available
    this._processQueue();

    this.emit('pipelineCreated', { pipelineId, config });
    
    return pipelineId;
  }

  /**
   * Process data through a specific pipeline
   * @param {string} pipelineId - Pipeline identifier
   * @param {Array} dataItems - Array of data items to process
   */
  async processPipelineData(pipelineId, dataItems) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    if (pipeline.status !== 'running') {
      throw new Error(`Pipeline ${pipelineId} is not in running state`);
    }

    pipeline.totalItems += dataItems.length;
    
    try {
      // Process items concurrently in batches
      const batchSize = parseInt(process.env.PIPELINE_BATCH_SIZE) || 5;
      const batches = this._createBatches(dataItems, batchSize);
      
      for (const batch of batches) {
        const batchPromises = batch.map(item => this._processSingleItem(pipelineId, item));
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Handle batch results
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            pipeline.results.push(result.value);
            pipeline.processedItems++;
          } else {
            console.error(`Error processing item in pipeline ${pipelineId}:`, result.reason);
            // Continue processing other items
          }
        });

        // Emit progress update
        this.emit('pipelineProgress', {
          pipelineId,
          processedItems: pipeline.processedItems,
          totalItems: pipeline.totalItems,
          progress: (pipeline.processedItems / pipeline.totalItems) * 100
        });

        // Real-time broadcast
        realTimeService.broadcast('pipeline_progress', {
          pipelineId,
          source: pipeline.source,
          sourceId: pipeline.sourceId,
          progress: (pipeline.processedItems / pipeline.totalItems) * 100,
          processedItems: pipeline.processedItems,
          totalItems: pipeline.totalItems
        });
      }

    } catch (error) {
      pipeline.error = error.message;
      pipeline.status = 'error';
      this.emit('pipelineError', { pipelineId, error: error.message });
      throw error;
    }
  }

  /**
   * Complete a pipeline
   * @param {string} pipelineId - Pipeline identifier
   */
  async completePipeline(pipelineId) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    pipeline.status = 'completed';
    pipeline.completedAt = new Date().toISOString();
    
    const processingTime = new Date(pipeline.completedAt) - new Date(pipeline.startedAt);
    pipeline.processingTime = processingTime;
    
    // Update metrics
    this.metrics.totalProcessed++;
    this.metrics.successCount++;
    this.metrics.pipelineHistory.push({
      pipelineId,
      source: pipeline.source,
      sourceId: pipeline.sourceId,
      processingTime,
      itemsProcessed: pipeline.processedItems,
      completedAt: pipeline.completedAt
    });

    // Keep only last 100 pipeline records
    if (this.metrics.pipelineHistory.length > 100) {
      this.metrics.pipelineHistory = this.metrics.pipelineHistory.slice(-100);
    }

    this._updateAverageProcessingTime();
    this.runningCount--;
    
    // Record analytics
    await enhancedAnalyticsService.recordPipelineMetrics(pipeline);
    
    this.emit('pipelineCompleted', { 
      pipelineId, 
      results: pipeline.results,
      processingTime,
      itemsProcessed: pipeline.processedItems
    });

    // Process next in queue
    this._processQueue();
  }

  /**
   * Stop a pipeline
   * @param {string} pipelineId - Pipeline identifier
   */
  async stopPipeline(pipelineId) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    pipeline.status = 'stopped';
    pipeline.completedAt = new Date().toISOString();
    
    if (pipeline.status === 'running') {
      this.runningCount--;
    }

    this.emit('pipelineStopped', { pipelineId });
    
    // Process next in queue
    this._processQueue();
  }

  /**
   * Get pipeline status
   * @param {string} pipelineId - Pipeline identifier
   */
  getPipelineStatus(pipelineId) {
    return this.activePipelines.get(pipelineId);
  }

  /**
   * Get all active pipelines
   */
  getAllPipelines() {
    return Array.from(this.activePipelines.values());
  }

  /**
   * Get pipeline metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activePipelines: this.activePipelines.size,
      runningPipelines: this.runningCount,
      queuedPipelines: this.pipelineQueue.length,
      maxConcurrent: this.maxConcurrentPipelines
    };
  }

  /**
   * Process the pipeline queue
   * @private
   */
  _processQueue() {
    while (this.runningCount < this.maxConcurrentPipelines && this.pipelineQueue.length > 0) {
      const pipelineId = this.pipelineQueue.shift();
      const pipeline = this.activePipelines.get(pipelineId);
      
      if (pipeline && pipeline.status === 'queued') {
        this._startPipeline(pipelineId);
      }
    }
  }

  /**
   * Start a specific pipeline
   * @private
   */
  async _startPipeline(pipelineId) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    pipeline.status = 'running';
    pipeline.startedAt = new Date().toISOString();
    this.runningCount++;

    this.emit('pipelineStarted', { pipelineId, pipeline });

    try {
      // Initialize data source collection
      const DataSourceService = require('./dataCollectionServices/dataSourceService').DataSourceService;
      const dataSourceService = new DataSourceService();
      
      const dataItems = await dataSourceService.collectData(
        pipeline.source, 
        pipeline.sourceId, 
        pipeline.options
      );

      if (dataItems && dataItems.length > 0) {
        await this.processPipelineData(pipelineId, dataItems);
      }

      await this.completePipeline(pipelineId);

    } catch (error) {
      pipeline.error = error.message;
      pipeline.status = 'error';
      pipeline.completedAt = new Date().toISOString();
      this.runningCount--;
      this.metrics.errorCount++;

      this.emit('pipelineError', { pipelineId, error: error.message });
      
      // Process next in queue
      this._processQueue();
    }
  }

  /**
   * Process a single item through the sentiment analysis pipeline
   * @private
   */
  async _processSingleItem(pipelineId, item) {
    const startTime = Date.now();
    
    try {
      const result = await pipelineService.process(item);
      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        pipelineId,
        processingTime
      };
    } catch (error) {
      console.error(`Error processing item in pipeline ${pipelineId}:`, error);
      throw error;
    }
  }

  /**
   * Create batches from array of items
   * @private
   */
  _createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Sort queue by priority
   * @private
   */
  _sortQueue() {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    
    this.pipelineQueue.sort((a, b) => {
      const pipelineA = this.activePipelines.get(a);
      const pipelineB = this.activePipelines.get(b);
      
      return priorityOrder[pipelineB.priority] - priorityOrder[pipelineA.priority];
    });
  }

  /**
   * Update average processing time metric
   * @private
   */
  _updateAverageProcessingTime() {
    if (this.metrics.pipelineHistory.length === 0) return;
    
    const totalTime = this.metrics.pipelineHistory.reduce((sum, record) => sum + record.processingTime, 0);
    this.metrics.avgProcessingTime = totalTime / this.metrics.pipelineHistory.length;
  }

  /**
   * Clean up completed pipelines older than specified time
   * @param {number} maxAgeHours - Maximum age in hours
   */
  cleanupOldPipelines(maxAgeHours = 24) {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    for (const [pipelineId, pipeline] of this.activePipelines.entries()) {
      if ((pipeline.status === 'completed' || pipeline.status === 'error' || pipeline.status === 'stopped') &&
          new Date(pipeline.completedAt) < cutoffTime) {
        this.activePipelines.delete(pipelineId);
      }
    }
  }
}

// Create singleton instance
const pipelineManager = new PipelineManager();

// Auto-cleanup every hour
setInterval(() => {
  pipelineManager.cleanupOldPipelines();
}, 60 * 60 * 1000);

module.exports = {
  PipelineManager,
  pipelineManager
};