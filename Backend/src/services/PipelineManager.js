const EventEmitter = require('events');
const { Worker } = require('worker_threads');
const path = require('path');
const uuid = require('uuid');

/**
 * Enhanced Pipeline Manager for concurrent sentiment analysis processing
 * Supports multiple input sources running in parallel with failure handling
 */
class PipelineManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.maxConcurrentPipelines = options.maxConcurrent || 10;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 5000;
    
    // Pipeline tracking
    this.activePipelines = new Map();
    this.pipelineQueue = [];
    this.completedPipelines = new Map();
    this.failedPipelines = new Map();
    
    // Performance metrics
    this.metrics = {
      totalProcessed: 0,
      totalFailed: 0,
      averageProcessingTime: 0,
      throughputPerMinute: 0,
      lastProcessedTimestamp: null
    };
    
    // Cleanup timer
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Clean every minute
    
    console.log(`PipelineManager initialized with max ${this.maxConcurrentPipelines} concurrent pipelines`);
  }

  /**
   * Add a new pipeline to the processing queue
   */
  async addPipeline(config) {
    const pipelineId = uuid.v4();
    const pipeline = {
      id: pipelineId,
      sourceType: config.sourceType,
      sourceId: config.sourceId,
      options: config.options || {},
      priority: config.priority || 'normal',
      retryCount: 0,
      createdAt: new Date(),
      status: 'queued',
      template: config.template || null
    };

    this.pipelineQueue.push(pipeline);
    this.emit('pipelineQueued', pipeline);
    
    console.log(`Pipeline ${pipelineId} queued for ${config.sourceType}:${config.sourceId}`);
    
    // Try to process immediately if capacity allows
    this.processQueue();
    
    return pipelineId;
  }

  /**
   * Process queued pipelines based on available capacity
   */
  async processQueue() {
    while (
      this.activePipelines.size < this.maxConcurrentPipelines && 
      this.pipelineQueue.length > 0
    ) {
      // Sort by priority: high -> normal -> low
      this.pipelineQueue.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      const pipeline = this.pipelineQueue.shift();
      await this.startPipeline(pipeline);
    }
  }

  /**
   * Start processing a specific pipeline
   */
  async startPipeline(pipeline) {
    try {
      pipeline.status = 'processing';
      pipeline.startedAt = new Date();
      this.activePipelines.set(pipeline.id, pipeline);

      this.emit('pipelineStarted', pipeline);
      console.log(`Starting pipeline ${pipeline.id} for ${pipeline.sourceType}:${pipeline.sourceId}`);

      // Create worker for CPU-bound sentiment analysis
      const worker = new Worker(path.join(__dirname, 'workers', 'sentimentWorker.js'), {
        workerData: {
          pipelineId: pipeline.id,
          sourceType: pipeline.sourceType,
          sourceId: pipeline.sourceId,
          options: pipeline.options
        }
      });

      // Handle worker messages
      worker.on('message', (message) => {
        this.handleWorkerMessage(pipeline.id, message);
      });

      // Handle worker errors
      worker.on('error', (error) => {
        this.handlePipelineError(pipeline.id, error);
      });

      // Handle worker exit
      worker.on('exit', (code) => {
        if (code !== 0) {
          this.handlePipelineError(pipeline.id, new Error(`Worker stopped with exit code ${code}`));
        }
      });

      // Store worker reference
      pipeline.worker = worker;

    } catch (error) {
      this.handlePipelineError(pipeline.id, error);
    }
  }

  /**
   * Handle messages from worker threads
   */
  handleWorkerMessage(pipelineId, message) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    switch (message.type) {
      case 'progress':
        pipeline.progress = message.progress;
        this.emit('pipelineProgress', pipeline, message.progress);
        break;

      case 'result':
        this.handlePipelineSuccess(pipelineId, message.result);
        break;

      case 'error':
        this.handlePipelineError(pipelineId, new Error(message.error));
        break;

      case 'data':
        this.emit('pipelineData', pipeline, message.data);
        break;
    }
  }

  /**
   * Handle successful pipeline completion
   */
  handlePipelineSuccess(pipelineId, result) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    pipeline.status = 'completed';
    pipeline.completedAt = new Date();
    pipeline.result = result;
    pipeline.processingTime = pipeline.completedAt - pipeline.startedAt;

    // Update metrics
    this.updateMetrics(pipeline);

    // Move to completed pipelines
    this.activePipelines.delete(pipelineId);
    this.completedPipelines.set(pipelineId, pipeline);

    // Clean up worker
    if (pipeline.worker) {
      pipeline.worker.terminate();
    }

    this.emit('pipelineCompleted', pipeline);
    console.log(`Pipeline ${pipelineId} completed successfully in ${pipeline.processingTime}ms`);

    // Process next in queue
    this.processQueue();
  }

  /**
   * Handle pipeline failure with retry logic
   */
  async handlePipelineError(pipelineId, error) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) return;

    console.error(`Pipeline ${pipelineId} failed:`, error.message);

    // Clean up worker
    if (pipeline.worker) {
      pipeline.worker.terminate();
    }

    // Check if we should retry
    if (pipeline.retryCount < this.maxRetries) {
      pipeline.retryCount++;
      pipeline.status = 'retrying';
      pipeline.lastError = error.message;

      this.emit('pipelineRetrying', pipeline, error);
      console.log(`Retrying pipeline ${pipelineId} (attempt ${pipeline.retryCount}/${this.maxRetries})`);

      // Move back to queue with delay
      this.activePipelines.delete(pipelineId);
      
      setTimeout(() => {
        pipeline.status = 'queued';
        this.pipelineQueue.unshift(pipeline); // Add to front for priority
        this.processQueue();
      }, this.retryDelay);

    } else {
      // Max retries exceeded - mark as failed
      pipeline.status = 'failed';
      pipeline.failedAt = new Date();
      pipeline.error = error.message;

      // Create failure template for analysis
      const failureTemplate = this.createFailureTemplate(pipeline, error);
      
      this.activePipelines.delete(pipelineId);
      this.failedPipelines.set(pipelineId, pipeline);

      this.metrics.totalFailed++;

      this.emit('pipelineFailed', pipeline, error, failureTemplate);
      console.error(`Pipeline ${pipelineId} failed permanently after ${this.maxRetries} retries`);

      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Create a failure template for pattern analysis
   */
  createFailureTemplate(pipeline, error) {
    const template = {
      id: uuid.v4(),
      pipelineId: pipeline.id,
      sourceType: pipeline.sourceType,
      sourceId: pipeline.sourceId,
      errorType: error.name || 'UnknownError',
      errorMessage: error.message,
      errorStack: error.stack,
      timestamp: new Date(),
      context: {
        retryCount: pipeline.retryCount,
        processingTime: pipeline.startedAt ? new Date() - pipeline.startedAt : 0,
        options: pipeline.options
      },
      patterns: this.extractErrorPatterns(error),
      recommendations: this.generateRecommendations(pipeline, error)
    };

    // Store template for future analysis
    this.storeFailureTemplate(template);
    
    return template;
  }

  /**
   * Extract error patterns for analysis
   */
  extractErrorPatterns(error) {
    const patterns = [];
    
    if (error.message.includes('timeout')) {
      patterns.push('TIMEOUT_ERROR');
    }
    if (error.message.includes('rate limit')) {
      patterns.push('RATE_LIMIT_ERROR');
    }
    if (error.message.includes('authentication')) {
      patterns.push('AUTH_ERROR');
    }
    if (error.message.includes('network')) {
      patterns.push('NETWORK_ERROR');
    }
    if (error.code) {
      patterns.push(`HTTP_${error.code}`);
    }

    return patterns;
  }

  /**
   * Generate recommendations based on error analysis
   */
  generateRecommendations(pipeline, error) {
    const recommendations = [];

    if (error.message.includes('timeout')) {
      recommendations.push('Increase timeout value in pipeline configuration');
      recommendations.push('Check network connectivity to data source');
    }
    
    if (error.message.includes('rate limit')) {
      recommendations.push('Implement exponential backoff for API requests');
      recommendations.push('Consider upgrading API plan for higher rate limits');
    }
    
    if (error.message.includes('authentication')) {
      recommendations.push('Verify API credentials are valid and not expired');
      recommendations.push('Check API key permissions for required endpoints');
    }

    return recommendations;
  }

  /**
   * Store failure template for pattern analysis
   */
  storeFailureTemplate(template) {
    // In a real implementation, this would store to a database
    // For now, we'll emit an event for external handling
    this.emit('failureTemplate', template);
  }

  /**
   * Update performance metrics
   */
  updateMetrics(pipeline) {
    this.metrics.totalProcessed++;
    this.metrics.lastProcessedTimestamp = new Date();
    
    // Update average processing time
    const currentAvg = this.metrics.averageProcessingTime;
    const newProcessingTime = pipeline.processingTime;
    this.metrics.averageProcessingTime = 
      (currentAvg * (this.metrics.totalProcessed - 1) + newProcessingTime) / this.metrics.totalProcessed;
    
    // Calculate throughput (simplified)
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const recentCompletions = Array.from(this.completedPipelines.values())
      .filter(p => p.completedAt > oneMinuteAgo).length;
    this.metrics.throughputPerMinute = recentCompletions;
  }

  /**
   * Get current pipeline status
   */
  getStatus() {
    return {
      active: this.activePipelines.size,
      queued: this.pipelineQueue.length,
      completed: this.completedPipelines.size,
      failed: this.failedPipelines.size,
      metrics: { ...this.metrics }
    };
  }

  /**
   * Get detailed pipeline information
   */
  getPipelineDetails(pipelineId) {
    return (
      this.activePipelines.get(pipelineId) ||
      this.completedPipelines.get(pipelineId) ||
      this.failedPipelines.get(pipelineId) ||
      this.pipelineQueue.find(p => p.id === pipelineId)
    );
  }

  /**
   * Stop a specific pipeline
   */
  async stopPipeline(pipelineId) {
    const pipeline = this.activePipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found or not active`);
    }

    if (pipeline.worker) {
      await pipeline.worker.terminate();
    }

    pipeline.status = 'stopped';
    pipeline.stoppedAt = new Date();

    this.activePipelines.delete(pipelineId);
    this.emit('pipelineStopped', pipeline);

    // Continue processing queue
    this.processQueue();
  }

  /**
   * Clean up old completed and failed pipelines
   */
  cleanup() {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = new Date(Date.now() - maxAge);

    // Clean up completed pipelines
    for (const [id, pipeline] of this.completedPipelines) {
      if (pipeline.completedAt < cutoff) {
        this.completedPipelines.delete(id);
      }
    }

    // Clean up failed pipelines
    for (const [id, pipeline] of this.failedPipelines) {
      if (pipeline.failedAt < cutoff) {
        this.failedPipelines.delete(id);
      }
    }

    console.log(`Cleanup completed. Active: ${this.activePipelines.size}, Completed: ${this.completedPipelines.size}, Failed: ${this.failedPipelines.size}`);
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('Shutting down PipelineManager...');
    
    // Clear cleanup interval
    clearInterval(this.cleanupInterval);
    
    // Terminate all active workers
    const terminationPromises = Array.from(this.activePipelines.values())
      .filter(p => p.worker)
      .map(p => p.worker.terminate());
    
    await Promise.all(terminationPromises);
    
    console.log('PipelineManager shutdown complete');
  }
}

module.exports = PipelineManager;