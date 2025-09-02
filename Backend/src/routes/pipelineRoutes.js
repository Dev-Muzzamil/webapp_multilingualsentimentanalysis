const express = require('express');
const router = express.Router();
const PipelineController = require('../controllers/pipelineController');

// Initialize controller
const pipelineController = new PipelineController();

/**
 * @route POST /api/pipelines/start
 * @desc Start a new sentiment analysis pipeline
 * @access Public (should be protected in production)
 */
router.post('/start', async (req, res) => {
  await pipelineController.startPipeline(req, res);
});

/**
 * @route POST /api/pipelines/batch
 * @desc Start multiple pipelines at once
 * @access Public (should be protected in production)
 */
router.post('/batch', async (req, res) => {
  await pipelineController.startBatchPipelines(req, res);
});

/**
 * @route GET /api/pipelines/status
 * @desc Get overall pipeline system status
 * @access Public
 */
router.get('/status', async (req, res) => {
  await pipelineController.getPipelineStatus(req, res);
});

/**
 * @route GET /api/pipelines/:pipelineId
 * @desc Get details for a specific pipeline
 * @access Public
 */
router.get('/:pipelineId', async (req, res) => {
  await pipelineController.getPipelineDetails(req, res);
});

/**
 * @route DELETE /api/pipelines/:pipelineId
 * @desc Stop a running pipeline
 * @access Public (should be protected in production)
 */
router.delete('/:pipelineId', async (req, res) => {
  await pipelineController.stopPipeline(req, res);
});

/**
 * @route GET /api/pipelines/analytics/overview
 * @desc Get pipeline analytics and insights
 * @access Public
 */
router.get('/analytics/overview', async (req, res) => {
  await pipelineController.getPipelineAnalytics(req, res);
});

/**
 * @route GET /api/pipelines/analytics/failures
 * @desc Get failure analysis and patterns
 * @access Public
 */
router.get('/analytics/failures', async (req, res) => {
  await pipelineController.getFailureAnalysis(req, res);
});

/**
 * @route GET /api/pipelines/health
 * @desc Health check for pipeline system
 * @access Public
 */
router.get('/health', async (req, res) => {
  await pipelineController.healthCheck(req, res);
});

// Export both router and controller for graceful shutdown
module.exports = {
  router,
  controller: pipelineController
};