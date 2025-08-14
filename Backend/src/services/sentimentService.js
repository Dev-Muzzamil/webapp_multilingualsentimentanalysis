const { LanguageServiceClient } = require('@google-cloud/language');

// Initialize the Google Cloud Language client
const client = new LanguageServiceClient();

async function analyzeSentiment(text, language = 'en') {
  try {
    // If no text provided, return neutral
    if (!text || !text.trim()) {
      return {
        sentiment: 'neutral',
        score: 0,
        magnitude: 0
      };
    }

    // Document for analysis
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
      language: language
    };

    // Perform sentiment analysis
    const [result] = await client.analyzeSentiment({
      document: document,
    });

    const sentiment = result.documentSentiment;
    
    // Determine sentiment label based on score
    let sentimentLabel = 'neutral';
    if (sentiment.score > 0.1) {
      sentimentLabel = 'positive';
    } else if (sentiment.score < -0.1) {
      sentimentLabel = 'negative';
    }

    return {
      sentiment: sentimentLabel,
      score: sentiment.score,
      magnitude: sentiment.magnitude,
      sentences: result.sentences ? result.sentences.map(sentence => ({
        text: sentence.text.content,
        sentiment: sentence.sentiment.score > 0.1 ? 'positive' : 
                  sentence.sentiment.score < -0.1 ? 'negative' : 'neutral',
        score: sentence.sentiment.score,
        magnitude: sentence.sentiment.magnitude
      })) : []
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    // Fallback to simple sentiment analysis if Google Cloud fails
    return simpleLocalSentiment(text);
  }
}

// Simple fallback sentiment analysis
function simpleLocalSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'joy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'disappointed', 'frustrating'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  const normalizedScore = Math.max(-1, Math.min(1, score / words.length));
  
  let sentiment = 'neutral';
  if (normalizedScore > 0.1) sentiment = 'positive';
  else if (normalizedScore < -0.1) sentiment = 'negative';
  
  return {
    sentiment,
    score: normalizedScore,
    magnitude: Math.abs(normalizedScore),
    fallback: true
  };
}

module.exports = { analyzeSentiment };