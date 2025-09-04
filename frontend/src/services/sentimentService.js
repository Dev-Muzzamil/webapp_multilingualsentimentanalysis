import api from './api.js';

export const sentimentService = {
  // Analyze single text
  analyzeSentiment: async (text) => {
    const payload = { text };
    try {
      const lang = localStorage.getItem('preferred_language');
      if (lang) payload.language = lang;
    } catch {
      // ignore
    }
    const response = await api.post('/api/sentiment/analyze', payload);
    return response.data;
  },

  // Get sentiment analysis results with filters
  getResults: async (filters) => {
    const response = await api.get('/api/analytics/results', { params: filters });
    return response.data;
  },

  // Get specific result by ID
  getResult: async (id) => {
    const response = await api.get(`/api/analytics/results/${id}`);
    return response.data;
  },

  // Delete result by ID
  deleteResult: async (id) => {
    const response = await api.delete(`/api/analytics/results/${id}`);
    return response.data;
  },
};

export default sentimentService;