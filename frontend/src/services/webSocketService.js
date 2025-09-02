import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      const wsUrl = url || import.meta.env.VITE_WS_URL || 'http://localhost:5000';
      
      this.socket = io(wsUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        resolve(this.socket);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      });

      // Handle sentiment analysis results
      this.socket.on('sentiment_result', (data) => {
        this.emit('sentiment_result', data);
      });

      this.socket.on('sentiment_results', (data) => {
        this.emit('sentiment_results', data);
      });

      this.socket.on('batch_results', (data) => {
        this.emit('batch_results', data);
      });

      this.socket.on('analysis_started', (data) => {
        this.emit('analysis_started', data);
      });

      this.socket.on('analysis_stopped', (data) => {
        this.emit('analysis_stopped', data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (callback) {
      const listeners = this.listeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // Data source analysis methods
  startDataSourceAnalysis(sourceType, sourceId, options) {
    if (this.socket) {
      this.socket.emit('start_analysis', { sourceType, sourceId, options });
    }
  }

  stopDataSourceAnalysis(sourceType, sourceId) {
    if (this.socket) {
      this.socket.emit('stop_analysis', { sourceType, sourceId });
    }
  }

  // Single text analysis
  analyzeText(text, options) {
    if (this.socket) {
      this.socket.emit('analyze_text', { text, options });
    }
  }

  // Batch text analysis
  analyzeBatch(texts, options) {
    if (this.socket) {
      this.socket.emit('analyze_batch', { texts, options });
    }
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;