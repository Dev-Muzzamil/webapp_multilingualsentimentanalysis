const { parentPort, workerData } = require('worker_threads');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

/**
 * Sentiment Analysis Worker
 * Handles CPU-bound sentiment analysis processing in a separate thread
 */
class SentimentWorker {
  constructor(data) {
    this.pipelineId = data.pipelineId;
    this.sourceType = data.sourceType;
    this.sourceId = data.sourceId;
    this.options = data.options || {};
    this.isRunning = false;
    this.processedCount = 0;
    this.errors = [];
  }

  /**
   * Start the sentiment analysis process
   */
  async start() {
    try {
      this.isRunning = true;
      this.sendMessage('progress', { status: 'starting', progress: 0 });

      console.log(`Worker ${this.pipelineId}: Starting analysis for ${this.sourceType}:${this.sourceId}`);

      // Step 1: Collect data from source
      const data = await this.collectData();
      this.sendMessage('progress', { status: 'data_collected', progress: 25, count: data.length });

      // Step 2: Process through sentiment analysis
      const results = await this.analyzeSentiment(data);
      this.sendMessage('progress', { status: 'analysis_complete', progress: 75, processed: results.length });

      // Step 3: Store results and emit final result
      const summary = await this.generateSummary(results);
      this.sendMessage('progress', { status: 'completed', progress: 100 });

      this.sendMessage('result', {
        pipelineId: this.pipelineId,
        sourceType: this.sourceType,
        sourceId: this.sourceId,
        summary,
        results,
        processedCount: this.processedCount,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Worker ${this.pipelineId} error:`, error);
      this.sendMessage('error', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Collect data from the specified source
   */
  async collectData() {
    const collectors = {
      youtube: () => this.collectYouTubeData(),
      twitter: () => this.collectTwitterData(),
      reddit: () => this.collectRedditData(),
      discord: () => this.collectDiscordData(),
      twitch: () => this.collectTwitchData(),
      telegram: () => this.collectTelegramData()
    };

    const collector = collectors[this.sourceType.toLowerCase()];
    if (!collector) {
      throw new Error(`Unsupported source type: ${this.sourceType}`);
    }

    return await collector();
  }

  /**
   * YouTube data collection
   */
  async collectYouTubeData() {
    try {
      // Mock YouTube API call - in real implementation, use YouTube Data API
      const mockData = [
        "Great video! Really enjoyed it 😊",
        "This is amazing content, keep it up!",
        "Not what I expected, disappointed",
        "Love the editing and music choice",
        "Could be better, but good effort",
        "Awesome tutorial, very helpful!",
        "Boring content, waste of time",
        "Perfect explanation, thank you!"
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockData.map((text, index) => ({
        id: `yt_${this.sourceId}_${index}`,
        text,
        source: 'youtube',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          videoId: this.sourceId,
          commentIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`YouTube data collection failed: ${error.message}`);
    }
  }

  /**
   * Twitter data collection
   */
  async collectTwitterData() {
    try {
      // Mock Twitter API call
      const mockData = [
        "Love this product! #amazing",
        "Terrible service, very disappointed 😠",
        "Just okay, nothing special",
        "Best purchase ever! Highly recommend 👍",
        "Could be improved, but decent",
        "Fantastic experience, will buy again!",
        "Not worth the money",
        "Good quality for the price"
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockData.map((text, index) => ({
        id: `tw_${this.sourceId}_${index}`,
        text,
        source: 'twitter',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          hashtag: this.sourceId,
          tweetIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`Twitter data collection failed: ${error.message}`);
    }
  }

  /**
   * Reddit data collection
   */
  async collectRedditData() {
    try {
      // Mock Reddit API call
      const mockData = [
        "This is a really good discussion thread",
        "I disagree with the main point here",
        "Neutral comment, just sharing info",
        "Excellent analysis, thanks for sharing!",
        "This could use more context",
        "Amazing insights from the community",
        "Not impressed with this approach",
        "Helpful information for beginners"
      ];

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return mockData.map((text, index) => ({
        id: `rd_${this.sourceId}_${index}`,
        text,
        source: 'reddit',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          subreddit: this.sourceId,
          commentIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`Reddit data collection failed: ${error.message}`);
    }
  }

  /**
   * Discord data collection
   */
  async collectDiscordData() {
    try {
      const mockData = [
        "Hey everyone! Great to be here 🎉",
        "This server is getting toxic lately",
        "Thanks for the help with the bot",
        "Love the community vibes here!",
        "Could we improve the moderation?",
        "Awesome event yesterday!",
        "Drama again... getting tired of this",
        "Welcome new members! 👋"
      ];

      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockData.map((text, index) => ({
        id: `dc_${this.sourceId}_${index}`,
        text,
        source: 'discord',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          serverId: this.sourceId,
          messageIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`Discord data collection failed: ${error.message}`);
    }
  }

  /**
   * Twitch data collection
   */
  async collectTwitchData() {
    try {
      const mockData = [
        "Poggers! Great stream! 🔥",
        "This streamer is boring zzz",
        "Love the gameplay!",
        "Nice moves! Keep it up 👏",
        "Chat is too fast lol",
        "Best stream today!",
        "Audio quality is bad",
        "Amazing content as always!"
      ];

      await new Promise(resolve => setTimeout(resolve, 900));
      
      return mockData.map((text, index) => ({
        id: `tw_${this.sourceId}_${index}`,
        text,
        source: 'twitch',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          channelId: this.sourceId,
          chatIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`Twitch data collection failed: ${error.message}`);
    }
  }

  /**
   * Telegram data collection
   */
  async collectTelegramData() {
    try {
      const mockData = [
        "Interesting article shared here 📰",
        "Don't like this topic, moving on",
        "Good discussion points raised",
        "Excellent resource, bookmarked! 🔖",
        "Could be more detailed",
        "Love these daily updates!",
        "Spam again... report this",
        "Helpful for my research, thanks!"
      ];

      await new Promise(resolve => setTimeout(resolve, 700));
      
      return mockData.map((text, index) => ({
        id: `tg_${this.sourceId}_${index}`,
        text,
        source: 'telegram',
        sourceId: this.sourceId,
        timestamp: new Date().toISOString(),
        metadata: {
          channelId: this.sourceId,
          messageIndex: index
        }
      }));
    } catch (error) {
      throw new Error(`Telegram data collection failed: ${error.message}`);
    }
  }

  /**
   * Analyze sentiment for collected data
   */
  async analyzeSentiment(data) {
    const results = [];
    const batchSize = 5; // Process in batches to show progress

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => this.analyzeSingleText(item))
      );
      
      results.push(...batchResults);
      this.processedCount += batchResults.length;

      // Send progress update
      const progress = Math.min(25 + (i / data.length) * 50, 75);
      this.sendMessage('progress', { 
        status: 'analyzing', 
        progress, 
        processed: this.processedCount,
        total: data.length 
      });

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Analyze sentiment for a single text
   */
  async analyzeSingleText(item) {
    try {
      // Call Python sentiment analysis service
      const sentimentResult = await this.callPythonSentimentAnalysis(item.text);
      
      return {
        ...item,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        score: sentimentResult.score,
        language: sentimentResult.language,
        translation: sentimentResult.translation,
        processingTime: sentimentResult.processingTime,
        method: 'advanced_ai',
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      this.errors.push({
        itemId: item.id,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Return with fallback sentiment
      return {
        ...item,
        sentiment: 'neutral',
        confidence: 0.5,
        score: 0.0,
        language: 'unknown',
        translation: null,
        processingTime: 0,
        method: 'fallback',
        error: error.message,
        analyzedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Call Python sentiment analysis service
   */
  async callPythonSentimentAnalysis(text) {
    return new Promise((resolve, reject) => {
      // Simulate Python service call with mock results
      setTimeout(() => {
        // Mock sentiment analysis result
        const sentiments = ['positive', 'negative', 'neutral'];
        const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
        const score = randomSentiment === 'positive' ? Math.random() * 0.8 + 0.2 :
                     randomSentiment === 'negative' ? Math.random() * -0.8 - 0.2 :
                     Math.random() * 0.4 - 0.2; // -0.2 to 0.2 for neutral

        resolve({
          sentiment: randomSentiment,
          confidence: parseFloat(confidence.toFixed(3)),
          score: parseFloat(score.toFixed(3)),
          language: 'en', // Mock language detection
          translation: null,
          processingTime: Math.floor(Math.random() * 200 + 50) // 50-250ms
        });
      }, Math.random() * 100 + 50); // Random delay 50-150ms
    });
  }

  /**
   * Generate summary of analysis results
   */
  async generateSummary(results) {
    const summary = {
      totalProcessed: results.length,
      sentimentDistribution: {
        positive: 0,
        negative: 0,
        neutral: 0
      },
      averageConfidence: 0,
      averageScore: 0,
      languageDistribution: {},
      processingTimeStats: {
        min: Infinity,
        max: 0,
        average: 0,
        total: 0
      },
      errorCount: this.errors.length,
      successRate: 0
    };

    let totalConfidence = 0;
    let totalScore = 0;
    let totalProcessingTime = 0;

    results.forEach(result => {
      // Sentiment distribution
      summary.sentimentDistribution[result.sentiment]++;

      // Confidence and score
      totalConfidence += result.confidence;
      totalScore += result.score;

      // Processing time stats
      totalProcessingTime += result.processingTime;
      summary.processingTimeStats.min = Math.min(summary.processingTimeStats.min, result.processingTime);
      summary.processingTimeStats.max = Math.max(summary.processingTimeStats.max, result.processingTime);

      // Language distribution
      if (!summary.languageDistribution[result.language]) {
        summary.languageDistribution[result.language] = 0;
      }
      summary.languageDistribution[result.language]++;
    });

    // Calculate averages
    if (results.length > 0) {
      summary.averageConfidence = parseFloat((totalConfidence / results.length).toFixed(3));
      summary.averageScore = parseFloat((totalScore / results.length).toFixed(3));
      summary.processingTimeStats.average = parseFloat((totalProcessingTime / results.length).toFixed(2));
      summary.processingTimeStats.total = totalProcessingTime;
      summary.successRate = parseFloat(((results.length - this.errors.length) / results.length).toFixed(3));
    }

    return summary;
  }

  /**
   * Send message to parent thread
   */
  sendMessage(type, data) {
    if (parentPort) {
      parentPort.postMessage({ type, ...data });
    }
  }
}

// Initialize and start worker
if (workerData) {
  const worker = new SentimentWorker(workerData);
  worker.start().catch(error => {
    console.error('Worker failed:', error);
    if (parentPort) {
      parentPort.postMessage({ type: 'error', error: error.message });
    }
    process.exit(1);
  });
}

module.exports = SentimentWorker;