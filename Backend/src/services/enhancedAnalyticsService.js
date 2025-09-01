const dbService = require('./core/dbService');

/**
 * Enhanced Analytics Service with Advanced Metrics
 * Provides comprehensive pipeline performance tracking and analytics
 */
class EnhancedAnalyticsService {
  constructor() {
    this.metrics = {
      performance: {
        totalPipelines: 0,
        successfulPipelines: 0,
        failedPipelines: 0,
        averageProcessingTime: 0,
        processingTimeHistory: []
      },
      usage: {
        sourceDistribution: {},
        hourlyDistribution: {},
        dailyActiveUsers: 0,
        totalApiCalls: 0
      },
      pipeline: {
        queueStats: {
          averageWaitTime: 0,
          maxWaitTime: 0,
          currentQueueLength: 0
        },
        concurrencyStats: {
          maxConcurrent: 0,
          averageConcurrent: 0,
          peakUsageHours: []
        }
      }
    };
  }

  /**
   * Record pipeline performance metrics
   */
  async recordPipelineMetrics(pipelineData) {
    try {
      const processingTime = pipelineData.processingTime || 0;
      const startTime = new Date(pipelineData.startedAt);
      const completedTime = new Date(pipelineData.completedAt);
      
      // Update performance metrics
      this.metrics.performance.totalPipelines++;
      
      if (pipelineData.status === 'completed') {
        this.metrics.performance.successfulPipelines++;
      } else if (pipelineData.status === 'error') {
        this.metrics.performance.failedPipelines++;
      }

      // Update processing time history
      this.metrics.performance.processingTimeHistory.push({
        timestamp: completedTime.toISOString(),
        processingTime,
        source: pipelineData.source,
        itemsProcessed: pipelineData.processedItems
      });

      // Keep only last 1000 records
      if (this.metrics.performance.processingTimeHistory.length > 1000) {
        this.metrics.performance.processingTimeHistory = 
          this.metrics.performance.processingTimeHistory.slice(-1000);
      }

      // Recalculate average processing time
      this._updateAverageProcessingTime();

      // Update source distribution
      this._updateSourceDistribution(pipelineData.source);

      // Update hourly distribution
      this._updateHourlyDistribution(startTime);

      // Save to database
      await this._savePipelineAnalytics(pipelineData);

    } catch (error) {
      console.error('Error recording pipeline metrics:', error);
    }
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboardAnalytics(timeRange = 'day') {
    try {
      // Get base analytics from existing service
      const baseAnalytics = await dbService.getAnalytics({ timeRange });

      // Get enhanced metrics
      const enhancedMetrics = await this._getEnhancedMetrics(timeRange);

      // Get pipeline performance stats
      const performanceStats = this._getPerformanceStats();

      // Get usage statistics
      const usageStats = this._getUsageStats();

      return {
        ...baseAnalytics,
        enhanced: {
          performance: performanceStats,
          usage: usageStats,
          pipeline: this.metrics.pipeline,
          system: {
            timestamp: new Date().toISOString(),
            timeRange
          }
        }
      };

    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }

  /**
   * Get real-time pipeline statistics
   */
  getRealTimeStats() {
    return {
      performance: {
        successRate: this._calculateSuccessRate(),
        averageProcessingTime: this.metrics.performance.averageProcessingTime,
        recentThroughput: this._calculateRecentThroughput()
      },
      usage: {
        activeSourceTypes: Object.keys(this.metrics.usage.sourceDistribution).length,
        totalSources: Object.values(this.metrics.usage.sourceDistribution)
          .reduce((sum, count) => sum + count, 0),
        currentHourActivity: this._getCurrentHourActivity()
      },
      pipeline: this.metrics.pipeline
    };
  }

  /**
   * Get performance insights and recommendations
   */
  getPerformanceInsights() {
    const insights = [];
    const recommendations = [];

    // Analyze success rate
    const successRate = this._calculateSuccessRate();
    if (successRate < 0.95) {
      insights.push({
        type: 'warning',
        title: 'Low Success Rate',
        description: `Current success rate is ${(successRate * 100).toFixed(1)}%`,
        impact: 'medium'
      });
      recommendations.push({
        type: 'performance',
        title: 'Improve Error Handling',
        description: 'Consider implementing retry mechanisms for failed pipelines'
      });
    }

    // Analyze processing time trends
    const processingTimeTrend = this._analyzeProcessingTimeTrend();
    if (processingTimeTrend.isIncreasing) {
      insights.push({
        type: 'warning',
        title: 'Increasing Processing Time',
        description: `Processing time has increased by ${processingTimeTrend.percentageIncrease}% over time`,
        impact: 'high'
      });
      recommendations.push({
        type: 'optimization',
        title: 'Optimize Pipeline Performance',
        description: 'Consider scaling resources or optimizing processing algorithms'
      });
    }

    // Analyze concurrency usage
    const concurrencyUsage = this._analyzeConcurrencyUsage();
    if (concurrencyUsage.utilizationRate > 0.8) {
      insights.push({
        type: 'info',
        title: 'High Concurrency Usage',
        description: `System is running at ${(concurrencyUsage.utilizationRate * 100).toFixed(1)}% capacity`,
        impact: 'medium'
      });
      recommendations.push({
        type: 'scaling',
        title: 'Consider Increasing Concurrency Limit',
        description: 'System is frequently at capacity, consider increasing MAX_CONCURRENT_PIPELINES'
      });
    }

    return {
      insights,
      recommendations,
      overallHealth: this._calculateOverallHealth()
    };
  }

  /**
   * Get usage patterns and trends
   */
  async getUsagePatterns() {
    try {
      return {
        sourcePopularity: this._getSourcePopularity(),
        peakUsageHours: this._getPeakUsageHours(),
        processingVolumeByHour: this._getProcessingVolumeByHour(),
        userBehaviorPatterns: await this._getUserBehaviorPatterns()
      };
    } catch (error) {
      console.error('Error getting usage patterns:', error);
      throw error;
    }
  }

  // Private helper methods

  _updateAverageProcessingTime() {
    const times = this.metrics.performance.processingTimeHistory.map(record => record.processingTime);
    if (times.length > 0) {
      this.metrics.performance.averageProcessingTime = 
        times.reduce((sum, time) => sum + time, 0) / times.length;
    }
  }

  _updateSourceDistribution(source) {
    this.metrics.usage.sourceDistribution[source] = 
      (this.metrics.usage.sourceDistribution[source] || 0) + 1;
  }

  _updateHourlyDistribution(timestamp) {
    const hour = timestamp.getHours();
    this.metrics.usage.hourlyDistribution[hour] = 
      (this.metrics.usage.hourlyDistribution[hour] || 0) + 1;
  }

  _calculateSuccessRate() {
    const total = this.metrics.performance.totalPipelines;
    if (total === 0) return 1;
    return this.metrics.performance.successfulPipelines / total;
  }

  _calculateRecentThroughput() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRecords = this.metrics.performance.processingTimeHistory
      .filter(record => new Date(record.timestamp) > oneHourAgo);
    
    return {
      pipelinesCompleted: recentRecords.length,
      itemsProcessed: recentRecords.reduce((sum, record) => sum + (record.itemsProcessed || 0), 0),
      averageTime: recentRecords.length > 0 
        ? recentRecords.reduce((sum, record) => sum + record.processingTime, 0) / recentRecords.length 
        : 0
    };
  }

  _getCurrentHourActivity() {
    const currentHour = new Date().getHours();
    return this.metrics.usage.hourlyDistribution[currentHour] || 0;
  }

  _analyzeProcessingTimeTrend() {
    const history = this.metrics.performance.processingTimeHistory;
    if (history.length < 10) {
      return { isIncreasing: false, percentageIncrease: 0 };
    }

    const recent = history.slice(-10);
    const older = history.slice(-20, -10);

    const recentAvg = recent.reduce((sum, r) => sum + r.processingTime, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.processingTime, 0) / older.length;

    const percentageIncrease = ((recentAvg - olderAvg) / olderAvg) * 100;

    return {
      isIncreasing: percentageIncrease > 10,
      percentageIncrease: Math.abs(percentageIncrease)
    };
  }

  _analyzeConcurrencyUsage() {
    // This would be updated by the pipeline manager
    return {
      utilizationRate: 0.5, // Placeholder
      averageQueueWaitTime: 0,
      peakConcurrency: 0
    };
  }

  _calculateOverallHealth() {
    const successRate = this._calculateSuccessRate();
    const processingTimeTrend = this._analyzeProcessingTimeTrend();
    
    let score = 100;
    
    // Deduct for low success rate
    if (successRate < 0.95) score -= (0.95 - successRate) * 100;
    
    // Deduct for increasing processing time
    if (processingTimeTrend.isIncreasing) score -= processingTimeTrend.percentageIncrease;
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: Math.round(score),
      status: score > 80 ? 'excellent' : score > 60 ? 'good' : score > 40 ? 'fair' : 'poor'
    };
  }

  _getSourcePopularity() {
    const total = Object.values(this.metrics.usage.sourceDistribution)
      .reduce((sum, count) => sum + count, 0);
    
    const popularity = {};
    for (const [source, count] of Object.entries(this.metrics.usage.sourceDistribution)) {
      popularity[source] = {
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    }
    
    return popularity;
  }

  _getPeakUsageHours() {
    const sorted = Object.entries(this.metrics.usage.hourlyDistribution)
      .sort(([,a], [,b]) => b - a);
    
    return sorted.slice(0, 5).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      timeRange: `${hour}:00 - ${hour}:59`
    }));
  }

  _getProcessingVolumeByHour() {
    const hourlyVolume = {};
    
    this.metrics.performance.processingTimeHistory.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      if (!hourlyVolume[hour]) {
        hourlyVolume[hour] = { pipelines: 0, items: 0 };
      }
      hourlyVolume[hour].pipelines++;
      hourlyVolume[hour].items += record.itemsProcessed || 0;
    });
    
    return hourlyVolume;
  }

  async _getUserBehaviorPatterns() {
    // This would analyze user request patterns
    return {
      averageRequestsPerSession: 0,
      popularSourceCombinations: [],
      timeBasedUsagePatterns: {}
    };
  }

  _getPerformanceStats() {
    return {
      totalPipelines: this.metrics.performance.totalPipelines,
      successRate: this._calculateSuccessRate(),
      averageProcessingTime: this.metrics.performance.averageProcessingTime,
      recentThroughput: this._calculateRecentThroughput()
    };
  }

  _getUsageStats() {
    return {
      sourceDistribution: this.metrics.usage.sourceDistribution,
      hourlyDistribution: this.metrics.usage.hourlyDistribution,
      totalApiCalls: this.metrics.usage.totalApiCalls
    };
  }

  async _getEnhancedMetrics(timeRange) {
    // Enhanced metrics specific to timeRange
    return {
      processingTimeVariance: this._calculateProcessingTimeVariance(),
      errorPatterns: await this._analyzeErrorPatterns(),
      resourceUtilization: this._getResourceUtilization()
    };
  }

  _calculateProcessingTimeVariance() {
    const times = this.metrics.performance.processingTimeHistory.map(r => r.processingTime);
    if (times.length < 2) return 0;
    
    const mean = times.reduce((sum, time) => sum + time, 0) / times.length;
    const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length;
    
    return variance;
  }

  async _analyzeErrorPatterns() {
    // This would analyze common error patterns
    return {
      commonErrors: [],
      errorsBySource: {},
      errorTrends: []
    };
  }

  _getResourceUtilization() {
    return {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
  }

  async _savePipelineAnalytics(pipelineData) {
    try {
      // Save enhanced analytics to database
      // This would extend the existing dbService to save additional metrics
      
      const analyticsRecord = {
        pipelineId: pipelineData.id,
        source: pipelineData.source,
        sourceId: pipelineData.sourceId,
        processingTime: pipelineData.processingTime,
        itemsProcessed: pipelineData.processedItems,
        status: pipelineData.status,
        timestamp: new Date().toISOString(),
        metrics: {
          queueWaitTime: pipelineData.queueWaitTime || 0,
          memoryUsage: process.memoryUsage().heapUsed,
          errorDetails: pipelineData.error
        }
      };

      // This would be saved to a separate analytics collection
      // await dbService.savePipelineAnalytics(analyticsRecord);
      
    } catch (error) {
      console.error('Error saving pipeline analytics:', error);
    }
  }
}

// Create singleton instance
const enhancedAnalyticsService = new EnhancedAnalyticsService();

module.exports = {
  EnhancedAnalyticsService,
  enhancedAnalyticsService
};