const express = require('express');
const cors = require('cors');
const sentimentRoutes = require('./src/routes/sentiment');
const analyticsRoutes = require('./src/routes/analytics');
const dataSourceRoutes = require('./src/routes/dataSources');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/data', dataSourceRoutes);


// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Multilingual Sentiment Analysis API',
    version: '1.0.0',
    endpoints: {
      sentiment: '/api/sentiment',
      analytics: '/api/analytics',
      dataSources: '/api/data',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

module.exports = app;