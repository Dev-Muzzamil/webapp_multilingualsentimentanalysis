const express = require('express');
const router = express.Router();
const pipeline = require('../services/pipelineService');

// POST /api/test-ingest
router.post('/', async (req, res) => {
  try {
    const { text, source = 'test', id = `mock_${Date.now()}`, timestamp = new Date().toISOString(), ...rest } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    const data = { text, source, id, timestamp, ...rest };
    const result = await pipeline.process(data);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Test ingestion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
