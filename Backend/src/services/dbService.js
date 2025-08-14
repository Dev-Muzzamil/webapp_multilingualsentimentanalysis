const db = require('../config/firestore');

// In-memory fallback storage for development
let localResults = [];

async function saveResult(result) {
  try {
    // Try to save to Firestore first
    const docRef = await db.collection('sentimentResults').add({
      ...result,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore not available, using local storage:', error.message);
    
    // Fallback to in-memory storage
    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localResults.push({
      id,
      ...result,
      timestamp: new Date()
    });
    
    // Keep only last 1000 results in memory
    if (localResults.length > 1000) {
      localResults = localResults.slice(-1000);
    }
    
    return id;
  }
}

async function getResult(id) {
  try {
    // Try Firestore first
    const doc = await db.collection('sentimentResults').doc(id).get();
    if (doc.exists) {
      return doc.data();
    }
  } catch (error) {
    console.warn('Firestore not available, checking local storage:', error.message);
  }
  
  // Fallback to local storage
  const result = localResults.find(r => r.id === id);
  return result || null;
}

async function getResults(limit = 50, offset = 0) {
  try {
    // Try Firestore first
    const snapshot = await db.collection('sentimentResults')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.warn('Firestore not available, using local storage:', error.message);
    
    // Fallback to local storage
    const start = offset;
    const end = start + limit;
    return localResults
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(start, end);
  }
}

async function getAnalytics(timeRange = 3600000) { // Default 1 hour
  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeRange);
    
    // Try Firestore first
    const snapshot = await db.collection('sentimentResults')
      .where('timestamp', '>=', startTime)
      .where('timestamp', '<=', endTime)
      .get();
    
    const results = [];
    snapshot.forEach(doc => {
      results.push(doc.data());
    });
    
    return calculateAnalytics(results);
  } catch (error) {
    console.warn('Firestore not available, using local storage:', error.message);
    
    // Fallback to local storage
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeRange);
    
    const results = localResults.filter(r => 
      r.timestamp >= startTime && r.timestamp <= endTime
    );
    
    return calculateAnalytics(results);
  }
}

function calculateAnalytics(results) {
  const analytics = {
    total: results.length,
    byPlatform: {},
    bySentiment: {
      positive: 0,
      negative: 0,
      neutral: 0
    },
    byLanguage: {},
    timeRange: {
      start: results.length > 0 ? Math.min(...results.map(r => r.timestamp)) : null,
      end: results.length > 0 ? Math.max(...results.map(r => r.timestamp)) : null
    }
  };

  results.forEach(result => {
    // Platform analytics
    const platform = result.platform || 'unknown';
    analytics.byPlatform[platform] = (analytics.byPlatform[platform] || 0) + 1;

    // Sentiment analytics
    const sentiment = result.sentiment?.sentiment || 'neutral';
    analytics.bySentiment[sentiment] = (analytics.bySentiment[sentiment] || 0) + 1;

    // Language analytics
    const language = result.detectedLanguage || result.language || 'unknown';
    analytics.byLanguage[language] = (analytics.byLanguage[language] || 0) + 1;
  });

  return analytics;
}

module.exports = { 
  saveResult, 
  getResult, 
  getResults, 
  getAnalytics 
};