const express = require('express');
const router = express.Router();
const dataSourceController = require('../controllers/dataSourceController');

// Get list of supported data sources
router.get('/sources', dataSourceController.getSupportedSources);

// Get status of data source APIs
router.get('/sources/status', dataSourceController.getSourceStatus);

// Collect and analyze data from a specific source (using ID)
router.post('/sources/:sourceType/:sourceId/collect', dataSourceController.collectAndAnalyze);

// Collect and analyze data from a YouTube video URL
router.post('/sources/youtube/collect/url', dataSourceController.collectAndAnalyzeFromUrl);

module.exports = router;