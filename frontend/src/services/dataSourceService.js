import api from './api.js';

export const dataSourceService = {
  // Get list of supported data sources
  getSupportedSources: async () => {
    const response = await api.get('/api/data/sources');
    return response.data;
  },

  // Get status of data source APIs
  getSourceStatus: async () => {
    const response = await api.get('/api/data/sources/status');
    return response.data;
  },

  // Validate source ID for a given source type
  validateSource: async (sourceType, sourceId) => {
    const response = await api.get(`/api/data/sources/${sourceType}/validate/${sourceId}`);
    return response.data;
  },

  // Collect data from a specific source
  collectData: async (sourceType, sourceId, options) => {
    const response = await api.post(`/api/data/sources/${sourceType}/${sourceId}/collect`, options || {});
    return response.data;
  },
};

export default dataSourceService;