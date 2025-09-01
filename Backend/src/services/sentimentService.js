
const axios = require('axios');

const AZURE_TEXT_ANALYTICS_KEY = process.env.AZURE_TEXT_ANALYTICS_KEY;
const AZURE_TEXT_ANALYTICS_ENDPOINT = process.env.AZURE_TEXT_ANALYTICS_ENDPOINT;

async function analyzeSentiment(text) {
  if (!text || !text.trim()) {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0
    };
  }
  try {
    const url = `${AZURE_TEXT_ANALYTICS_ENDPOINT}/text/analytics/v3.1/sentiment`;
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_TEXT_ANALYTICS_KEY,
      'Content-Type': 'application/json'
    };
    const body = {
      documents: [
        {
          id: '1',
          language: 'en', // You can set this dynamically if you know the language
          text: text
        }
      ]
    };
    const response = await axios.post(url, body, { headers });
    const doc = response.data.documents[0];
    // Azure returns confidence scores for positive, neutral, negative
    let label = doc.sentiment;
    let score = doc.confidenceScores[label] || 0;
    return {
      sentiment: label,
      score: score,
      confidence: score,
      method: 'azure_text_analytics',
      confidenceScores: doc.confidenceScores
    };
  } catch (err) {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
      error: err.message
    };
  }
}

module.exports = { analyzeSentiment };


