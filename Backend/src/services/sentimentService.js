const axios = require('axios');

// For this implementation, we'll use multiple approaches:
// 1. Google Cloud Natural Language API (primary)
// 2. TextBlob via Python service (fallback)
// 3. Simple keyword-based analysis (final fallback)

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:5002';

async function analyzeSentiment(text, language = 'en') {
  if (!text || !text.trim()) {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0
    };
  }

  try {
    // Try Google Cloud Natural Language API first
    const cloudResult = await analyzeWithCloudNL(text);
    if (cloudResult) return cloudResult;
  } catch (err) {
    console.warn('Cloud NL API failed, trying fallback:', err.message);
  }

  try {
    // Fallback to Python service
    const pythonResult = await analyzeWithPython(text, language);
    if (pythonResult) return pythonResult;
  } catch (err) {
    console.warn('Python service failed, using simple analysis:', err.message);
  }

  // Final fallback - simple keyword-based analysis
  return simpleAnalysis(text);
}

async function analyzeWithCloudNL(text) {
  // This would use @google-cloud/language if credentials are available
  // For now, return null to indicate unavailable
  return null;
}

async function analyzeWithPython(text, language) {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/sentiment`, {
      text,
      language
    }, { timeout: 5000 });
    
    return response.data;
  } catch (err) {
    throw new Error(`Python service error: ${err.message}`);
  }
}

function simpleAnalysis(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'joy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'disappointed', 'horrible', 'disgusting'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });
  
  const totalScore = positiveScore - negativeScore;
  const normalizedScore = Math.max(-1, Math.min(1, totalScore / Math.max(1, words.length / 10)));
  
  let sentiment = 'neutral';
  if (normalizedScore > 0.1) sentiment = 'positive';
  else if (normalizedScore < -0.1) sentiment = 'negative';
  
  return {
    sentiment,
    score: normalizedScore,
    confidence: Math.abs(normalizedScore),
    method: 'simple_keyword'
  };
}

module.exports = { analyzeSentiment };