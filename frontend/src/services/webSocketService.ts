import { io, Socket } from 'socket.io-client';
import { WebSocketMessage, RealTimeAnalysis, SentimentResult } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(url?: string): Promise<Socket> {
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
        resolve(this.socket!);
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
      this.socket.on('sentiment_result', (data: SentimentResult) => {
        this.emit('sentiment_result', data);
      });

      this.socket.on('sentiment_results', (data: RealTimeAnalysis) => {
        this.emit('sentiment_results', data);
      });

      this.socket.on('batch_results', (data: { results: SentimentResult[]; timestamp: string }) => {
        this.emit('batch_results', data);
      });

      this.socket.on('analysis_started', (data: { sourceType: string; sourceId: string; collectionId: string }) => {
        this.emit('analysis_started', data);
      });

      this.socket.on('analysis_stopped', (data: { sourceType: string; sourceId: string }) => {
        this.emit('analysis_stopped', data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listener management
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function): void {
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

  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // Data source analysis methods
  startDataSourceAnalysis(sourceType: string, sourceId: string, options?: any): void {
    if (this.socket) {
      this.socket.emit('start_analysis', { sourceType, sourceId, options });
    }
  }

  stopDataSourceAnalysis(sourceType: string, sourceId: string): void {
    if (this.socket) {
      this.socket.emit('stop_analysis', { sourceType, sourceId });
    }
  }

  // Single text analysis
  analyzeText(text: string, options?: any): void {
    if (this.socket) {
      this.socket.emit('analyze_text', { text, options });
    }
  }

  // Batch text analysis
  analyzeBatch(texts: string[], options?: any): void {
    if (this.socket) {
      this.socket.emit('analyze_batch', { texts, options });
    }
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;