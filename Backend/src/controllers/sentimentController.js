const pipeline = require('../services/pipelineService');
const { v4: uuidv4 } = require('uuid');

/**
 * Analyzes a single piece of text by sending it through the main processing pipeline.
 */
exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required.' });
    }

    // Create a unified data object for the ad-hoc text
    const dataItem = {
      source: 'direct',
      id: uuidv4(), // Generate a unique ID for traceability
      timestamp: new Date().toISOString(),
      text: text
    };

    // Process the single item through the pipeline
    const result = await pipeline.process(dataItem);

    res.json({ success: true, data: result });

  } catch (err) {
    console.error('Error in analyze controller:', err);
    res.status(500).json({
        success: false,
        error: 'Failed to analyze text',
        message: err.message
    });
  }
};