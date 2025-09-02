import api from './api';
import type { AnalyticsData, DashboardData } from '../types';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async (options?: {
    timeRange?: 'hour' | 'day' | 'week' | 'month';
    source?: string;
    sourceId?: string;
  }): Promise<{ success: boolean; data: AnalyticsData }> => {
    const response = await api.get('/api/analytics/analytics', { params: options });
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async (): Promise<{ success: boolean; data: DashboardData }> => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  // Get analytics for specific source type
  getSourceAnalytics: async (sourceType: string, timeRange?: string): Promise<{ 
    success: boolean; 
    data: AnalyticsData; 
    sourceType: string 
  }> => {
    const response = await api.get(`/api/analytics/analytics/source/${sourceType}`, {
      params: { timeRange }
    });
    return response.data;
  },

  // Compare multiple sources
  compareSources: async (sources: string[], timeRange?: string): Promise<{ 
    success: boolean; 
    data: Record<string, AnalyticsData>; 
    timeRange: string 
  }> => {
    const response = await api.get('/api/analytics/analytics/compare', {
      params: { sources: sources.join(','), timeRange }
    });
    return response.data;
  },
};

export default analyticsService;