import api from './api';
import { SentimentResult } from '../types';

export const sentimentService = {
  // Analyze single text
  analyzeSentiment: async (text: string): Promise<SentimentResult> => {
    const payload: Record<string, unknown> = { text };
    try {
      const lang = localStorage.getItem('preferred_language');
      if (lang) (payload as Record<string, unknown>)['language'] = lang;
    } catch {
      // ignore
    }
    const response = await api.post('/api/sentiment/analyze', payload);
    return response.data;
  },

  // Get sentiment analysis results with filters
  getResults: async (filters?: {
    source?: string;
    sourceId?: string;
    sentiment?: string;
    language?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: SentimentResult[]; count: number }> => {
    const response = await api.get('/api/analytics/results', { params: filters });
    return response.data;
  },

  // Get specific result by ID
  getResult: async (id: string): Promise<{ success: boolean; data: SentimentResult }> => {
    const response = await api.get(`/api/analytics/results/${id}`);
    return response.data;
  },

  // Delete result by ID
  deleteResult: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/analytics/results/${id}`);
    return response.data;
  },
};

export default sentimentService;