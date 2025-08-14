const express = require('express');
const cors = require('cors');
const sentimentRoutes = require('./src/api/sentiment');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/sentiment', sentimentRoutes);

module.exports = app;