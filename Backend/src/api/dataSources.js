const express = require('express');
const router = express.Router();
const dataSourceController = require('../controllers/dataSourceController');

// Get list of supported data sources
router.get('/sources', dataSourceController.getSupportedSources);

// Get status of data source APIs
router.get('/sources/status', dataSourceController.getSourceStatus);

// Validate source ID for a given source type
router.get('/sources/:sourceType/validate/:sourceId', dataSourceController.validateSource);

// Collect data from a specific source
router.post('/sources/:sourceType/:sourceId/collect', dataSourceController.collectData);

module.exports = router;