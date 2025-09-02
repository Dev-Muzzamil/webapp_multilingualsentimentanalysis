import api from './api';
import type { DataSource, YouTubeData } from '../types';

export const dataSourceService = {
  // Get list of supported data sources
  getSupportedSources: async (): Promise<{ success: boolean; data: DataSource[] }> => {
    const response = await api.get('/api/data/sources');
    return response.data;
  },

  // Get status of data source APIs
  getSourceStatus: async (): Promise<{ success: boolean; data: Record<string, { available: boolean; message: string }> }> => {
    const response = await api.get('/api/data/sources/status');
    return response.data;
  },

  // Validate source ID for a given source type
  validateSource: async (sourceType: string, sourceId: string): Promise<{ 
    success: boolean; 
    data: { sourceType: string; sourceId: string; isValid: boolean; message: string } 
  }> => {
    const response = await api.get(`/api/data/sources/${sourceType}/validate/${sourceId}`);
    return response.data;
  },

  // Collect data from a specific source
  collectData: async (sourceType: string, sourceId: string, options?: any): Promise<{ 
    success: boolean; 
    data: YouTubeData | any; 
    sourceType: string; 
    sourceId: string; 
    timestamp: string 
  }> => {
    const response = await api.post(`/api/data/sources/${sourceType}/${sourceId}/collect`, options || {});
    return response.data;
  },
};

export default dataSourceService;