import api from './api.js';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async (options) => {
    const response = await api.get('/api/analytics/analytics', { params: options });
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  // Get analytics for specific source type
  getSourceAnalytics: async (sourceType, timeRange) => {
    const response = await api.get(`/api/analytics/analytics/source/${sourceType}`, {
      params: { timeRange }
    });
    return response.data;
  },

  // Compare multiple sources
  compareSources: async (sources, timeRange) => {
    const response = await api.get('/api/analytics/analytics/compare', {
      params: { sources: sources.join(','), timeRange }
    });
    return response.data;
  },
};

export default analyticsService;