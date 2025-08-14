const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get all results with optional filtering
router.get('/results', analyticsController.getResults);

// Get specific result by ID
router.get('/results/:id', analyticsController.getResult);

// Delete specific result by ID
router.delete('/results/:id', analyticsController.deleteResult);

// Get analytics data
router.get('/analytics', analyticsController.getAnalytics);

// Get dashboard data (overview)
router.get('/dashboard', analyticsController.getDashboardData);

// Get analytics for specific source type
router.get('/analytics/source/:sourceType', analyticsController.getSourceAnalytics);

// Compare multiple sources
router.get('/analytics/compare', analyticsController.compareSources);

module.exports = router;