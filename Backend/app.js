const express = require('express');
const cors = require('cors');
const sentimentRoutes = require('./src/api/sentiment');
const platformRoutes = require('./src/api/platforms');
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/platforms', platformRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      api: 'running',
      database: 'connected' // This would be checked dynamically
    }
  });
});

// Basic info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Multilingual Sentiment Analysis API',
    version: '1.0.0',
    description: 'Real-time multilingual sentiment analysis for social media platforms',
    endpoints: {
      sentiment: '/api/sentiment/analyze',
      platforms: '/api/platforms',
      health: '/health'
    }
  });
});

module.exports = app;