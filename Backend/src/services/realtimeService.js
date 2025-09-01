const { Server } = require('socket.io');
const { DataSourceService } = require('./dataCollectionServices/dataSourceService');
const { detectLanguage } = require('./languagedetectionandpreprocessing/languageDetectionService');
const { translateText } = require('./translationService');
const { preprocessText, extractTextFromSource } = require('./languagedetectionandpreprocessing/preprocessingService');
const { analyzeSentiment } = require('./sentimentService');
const { saveResult } = require('./core/dbService');

class RealTimeService {
  constructor() {
    this.io = null;
    this.dataSourceService = new DataSourceService();
    this.activeCollections = new Map();
    this.clientSessions = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.clientSessions.set(socket.id, { collections: [] });

      // Handle client requests for data source analysis
      socket.on('start_analysis', async (data) => {
        await this.startDataSourceAnalysis(socket, data);
      });

      // Handle stopping analysis
      socket.on('stop_analysis', (data) => {
        this.stopDataSourceAnalysis(socket, data);
      });

      // Handle single text analysis
      socket.on('analyze_text', async (data) => {
        await this.analyzeText(socket, data);
      });

      // Handle batch text analysis
      socket.on('analyze_batch', async (data) => {
        await this.analyzeBatch(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.cleanupClientSessions(socket.id);
      });
    });

    return this.io;
  }

  async startDataSourceAnalysis(socket, data) {
    try {
      const { sourceType, sourceId, options = {} } = data;
      
      if (!sourceType || !sourceId) {
        socket.emit('error', { message: 'Source type and ID are required' });
        return;
      }

      // Start real-time collection
      const collection = await this.dataSourceService.startRealTimeCollection(
        sourceType,
        sourceId,
        async (sourceData) => {
          await this.processSourceData(socket, sourceData, options);
        },
        options
      );

      // Track the collection
      const collectionKey = `${sourceType}:${sourceId}`;
      this.activeCollections.set(collectionKey, collection);
      
      const clientSession = this.clientSessions.get(socket.id);
      if (clientSession) {
        clientSession.collections.push(collectionKey);
      }

      socket.emit('analysis_started', {
        sourceType,
        sourceId,
        collectionId: collectionKey
      });

      // Also get initial data
      const initialData = await this.dataSourceService.collectData(sourceType, sourceId, options);
      await this.processSourceData(socket, { 
        source: sourceType, 
        sourceId, 
        data: initialData.comments || initialData.tweets || initialData.posts || initialData.messages || []
      }, options);

    } catch (error) {
      console.error('Error starting data source analysis:', error);
      socket.emit('error', { message: error.message });
    }
  }

  stopDataSourceAnalysis(socket, data) {
    try {
      const { sourceType, sourceId } = data;
      const collectionKey = `${sourceType}:${sourceId}`;
      
      const collection = this.activeCollections.get(collectionKey);
      if (collection) {
        this.dataSourceService.stopRealTimeCollection(collection.type, collection);
        this.activeCollections.delete(collectionKey);
      }

      const clientSession = this.clientSessions.get(socket.id);
      if (clientSession) {
        clientSession.collections = clientSession.collections.filter(key => key !== collectionKey);
      }

      socket.emit('analysis_stopped', { sourceType, sourceId });
    } catch (error) {
      console.error('Error stopping data source analysis:', error);
      socket.emit('error', { message: error.message });
    }
  }

  async processSourceData(socket, sourceData, options = {}) {
    try {
      const { source, sourceId, data } = sourceData;
      
      if (!data || !Array.isArray(data)) return;

      const results = [];
      
      for (const item of data.slice(0, 10)) { // Process max 10 items at a time
        try {
          const text = extractTextFromSource(item, source);
          if (!text || text.trim().length < 3) continue;

          const result = await this.processSingleText(text, { ...options, source, sourceId, item });
          results.push(result);
        } catch (error) {
          console.error('Error processing item:', error);
        }
      }

      if (results.length > 0) {
        socket.emit('sentiment_results', {
          source,
          sourceId,
          results,
          timestamp: new Date().toISOString()
        });

        // Save batch results (optional)
        for (const result of results) {
          try {
            const docId = await saveResult(result);
            result.id = docId;
          } catch (error) {
            console.warn('Error saving result:', error.message);
            result.warning = 'Result not persisted - database unavailable';
          }
        }
      }
    } catch (error) {
      console.error('Error processing source data:', error);
      socket.emit('error', { message: error.message });
    }
  }

  async analyzeText(socket, data) {
    try {
      const { text, options = {} } = data;
      
      if (!text || !text.trim()) {
        socket.emit('error', { message: 'Text is required' });
        return;
      }

      const result = await this.processSingleText(text, options);
      
      socket.emit('sentiment_result', result);
      
      // Save result (optional)
      try {
        const docId = await saveResult(result);
        result.id = docId;
      } catch (dbError) {
        console.warn('Failed to save to database:', dbError.message);
        result.warning = 'Result not persisted - database unavailable';
      }
      
    } catch (error) {
      console.error('Error analyzing text:', error);
      socket.emit('error', { message: error.message });
    }
  }

  async analyzeBatch(socket, data) {
    try {
      const { texts, options = {} } = data;
      
      if (!texts || !Array.isArray(texts)) {
        socket.emit('error', { message: 'Texts array is required' });
        return;
      }

      const results = [];
      
      for (const text of texts.slice(0, 50)) { // Process max 50 texts
        if (text && text.trim()) {
          try {
            const result = await this.processSingleText(text, options);
            results.push(result);
          } catch (error) {
            console.error('Error processing text in batch:', error);
          }
        }
      }

      socket.emit('batch_results', { results, timestamp: new Date().toISOString() });
      
      // Save batch results (optional)
      for (const result of results) {
        try {
          const docId = await saveResult(result);
          result.id = docId;
        } catch (error) {
          console.warn('Error saving batch result:', error.message);
          result.warning = 'Result not persisted - database unavailable';
        }
      }
      
    } catch (error) {
      console.error('Error analyzing batch:', error);
      socket.emit('error', { message: error.message });
    }
  }

  async processSingleText(text, options = {}) {
    // Step 1: Language Detection
    const language = await detectLanguage(text);

    // Step 2: Translation (if not English)
    let processedText = text;
    let translation = null;
    if (language !== 'en' && options.translateToEnglish !== false) {
      translation = await translateText(text, 'en');
      processedText = translation;
    }

    // Step 3: Preprocessing
    const cleanText = preprocessText(processedText, options.preprocessing || {});

    // Step 4: Sentiment Analysis
    const sentiment = await analyzeSentiment(cleanText, language);

    // Step 5: Compile result
    const result = {
      originalText: text,
      language,
      translation,
      cleanText,
      sentiment,
      source: options.source || 'manual',
      sourceId: options.sourceId || null,
      sourceItem: options.item || null,
      timestamp: new Date().toISOString(),
      processingTime: Date.now()
    };

    return result;
  }

  cleanupClientSessions(socketId) {
    const clientSession = this.clientSessions.get(socketId);
    if (clientSession) {
      // Stop all collections for this client
      for (const collectionKey of clientSession.collections) {
        const collection = this.activeCollections.get(collectionKey);
        if (collection) {
          this.dataSourceService.stopRealTimeCollection(collection.type, collection);
          this.activeCollections.delete(collectionKey);
        }
      }
      this.clientSessions.delete(socketId);
    }
  }

  // Broadcast to all connected clients
  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Send to specific client
  sendToClient(socketId, event, data) {
    if (this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

// Singleton instance
const realTimeService = new RealTimeService();

function initSocket(server) {
  return realTimeService.initialize(server);
}

module.exports = { initSocket, realTimeService };