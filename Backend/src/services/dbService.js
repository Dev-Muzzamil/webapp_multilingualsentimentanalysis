const db = require('../config/firestore');

async function saveResult(result) {
  try {
    const docRef = await db.collection('sentimentResults').add({
      ...result,
      timestamp: new Date(),
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving result to Firestore:', error);
    throw error;
  }
}

async function getResult(id) {
  try {
    const doc = await db.collection('sentimentResults').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error getting result from Firestore:', error);
    throw error;
  }
}

async function getResults(options = {}) {
  try {
    let query = db.collection('sentimentResults');
    
    // Add filters
    if (options.source) {
      query = query.where('source', '==', options.source);
    }
    
    if (options.sourceId) {
      query = query.where('sourceId', '==', options.sourceId);
    }
    
    if (options.sentiment) {
      query = query.where('sentiment.sentiment', '==', options.sentiment);
    }
    
    if (options.language) {
      query = query.where('language', '==', options.language);
    }
    
    if (options.startDate) {
      query = query.where('timestamp', '>=', new Date(options.startDate));
    }
    
    if (options.endDate) {
      query = query.where('timestamp', '<=', new Date(options.endDate));
    }
    
    // Add ordering
    query = query.orderBy('timestamp', 'desc');
    
    // Add limit
    if (options.limit) {
      query = query.limit(parseInt(options.limit));
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
  } catch (error) {
    console.error('Error getting results from Firestore:', error);
    throw error;
  }
}

async function getAnalytics(options = {}) {
  try {
    const timeRange = options.timeRange || 'day'; // day, week, month
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'hour':
        startDate.setHours(endDate.getHours() - 1);
        break;
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 1);
    }
    
    let query = db.collection('sentimentResults')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate);
    
    if (options.source) {
      query = query.where('source', '==', options.source);
    }
    
    const snapshot = await query.get();
    const results = snapshot.docs.map(doc => doc.data());
    
    // Calculate analytics
    const analytics = {
      totalResults: results.length,
      sentimentDistribution: {
        positive: 0,
        negative: 0,
        neutral: 0
      },
      languageDistribution: {},
      sourceDistribution: {},
      averageScore: 0,
      timeline: [],
      timeRange,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    let totalScore = 0;
    const timelineMap = new Map();
    
    results.forEach(result => {
      // Sentiment distribution
      const sentiment = result.sentiment?.sentiment || 'neutral';
      if (analytics.sentimentDistribution[sentiment] !== undefined) {
        analytics.sentimentDistribution[sentiment]++;
      }
      
      // Language distribution
      const language = result.language || 'unknown';
      analytics.languageDistribution[language] = (analytics.languageDistribution[language] || 0) + 1;
      
      // Source distribution
      const source = result.source || 'unknown';
      analytics.sourceDistribution[source] = (analytics.sourceDistribution[source] || 0) + 1;
      
      // Average score
      const score = result.sentiment?.score || 0;
      totalScore += score;
      
      // Timeline data
      const timestamp = result.timestamp?.toDate?.() || new Date(result.timestamp);
      const timeKey = getTimeKey(timestamp, timeRange);
      
      if (!timelineMap.has(timeKey)) {
        timelineMap.set(timeKey, {
          time: timeKey,
          positive: 0,
          negative: 0,
          neutral: 0,
          total: 0,
          averageScore: 0,
          scores: []
        });
      }
      
      const timeData = timelineMap.get(timeKey);
      timeData[sentiment]++;
      timeData.total++;
      timeData.scores.push(score);
    });
    
    // Calculate average scores for timeline
    timelineMap.forEach(timeData => {
      if (timeData.scores.length > 0) {
        timeData.averageScore = timeData.scores.reduce((a, b) => a + b, 0) / timeData.scores.length;
      }
      delete timeData.scores; // Remove raw scores from response
    });
    
    analytics.averageScore = results.length > 0 ? totalScore / results.length : 0;
    analytics.timeline = Array.from(timelineMap.values()).sort((a, b) => a.time.localeCompare(b.time));
    
    return analytics;
    
  } catch (error) {
    console.error('Error getting analytics from Firestore:', error);
    throw error;
  }
}

function getTimeKey(date, timeRange) {
  const d = new Date(date);
  switch (timeRange) {
    case 'hour':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:00`;
    case 'day':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    case 'week':
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      return `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getDate()) / 7)).padStart(2, '0')}`;
    case 'month':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    default:
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

async function deleteResult(id) {
  try {
    await db.collection('sentimentResults').doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error deleting result from Firestore:', error);
    throw error;
  }
}

async function updateResult(id, updates) {
  try {
    await db.collection('sentimentResults').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating result in Firestore:', error);
    throw error;
  }
}

// Bulk operations
async function saveResults(results) {
  try {
    const batch = db.batch();
    const savedIds = [];
    
    results.forEach(result => {
      const docRef = db.collection('sentimentResults').doc();
      batch.set(docRef, {
        ...result,
        timestamp: new Date(),
        createdAt: new Date().toISOString()
      });
      savedIds.push(docRef.id);
    });
    
    await batch.commit();
    return savedIds;
  } catch (error) {
    console.error('Error saving results batch to Firestore:', error);
    throw error;
  }
}

module.exports = { 
  saveResult, 
  getResult, 
  getResults, 
  getAnalytics,
  deleteResult, 
  updateResult,
  saveResults
};