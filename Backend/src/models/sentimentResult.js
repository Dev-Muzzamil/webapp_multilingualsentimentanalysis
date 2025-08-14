const mongoose = require('mongoose');

const SentimentResultSchema = new mongoose.Schema({
  text: { type: String, required: true },
  language: { type: String, required: true },
  translation: { type: String },
  sentiment: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SentimentResult', SentimentResultSchema);