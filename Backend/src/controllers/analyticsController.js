const { getResults, getAnalytics, getResult, deleteResult } = require('../services/core/dbService');

exports.getResults = async (req, res) => {
  try {
    const options = {
      source: req.query.source,
      sourceId: req.query.sourceId,
      sentiment: req.query.sentiment,
      language: req.query.language,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit || 100
    };

    // Remove undefined values
    Object.keys(options).forEach(key => {
      if (options[key] === undefined || options[key] === '') {
        delete options[key];
      }
    });

    const results = await getResults(options);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      filters: options
    });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve results',
      message: error.message
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const options = {
      timeRange: req.query.timeRange || 'day', // hour, day, week, month
      source: req.query.source,
      sourceId: req.query.sourceId
    };

    // Remove undefined values
    Object.keys(options).forEach(key => {
      if (options[key] === undefined || options[key] === '') {
        delete options[key];
      }
    });

    const analytics = await getAnalytics(options);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve analytics',
      message: error.message
    });
  }
};

exports.getResult = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Result ID is required' 
      });
    }

    const result = await getResult(id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Result not found' 
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting result:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve result',
      message: error.message
    });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Result ID is required' 
      });
    }

    await deleteResult(id);
    
    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete result',
      message: error.message
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    // Get recent analytics for dashboard
    const [hourlyAnalytics, dailyAnalytics] = await Promise.all([
      getAnalytics({ timeRange: 'hour' }),
      getAnalytics({ timeRange: 'day' })
    ]);

    // Get recent results
    const recentResults = await getResults({ limit: 10 });

    const dashboardData = {
      overview: {
        totalToday: dailyAnalytics.totalResults,
        totalLastHour: hourlyAnalytics.totalResults,
        averageScoreToday: dailyAnalytics.averageScore,
        averageScoreLastHour: hourlyAnalytics.averageScore
      },
      sentimentDistribution: dailyAnalytics.sentimentDistribution,
      languageDistribution: dailyAnalytics.languageDistribution,
      sourceDistribution: dailyAnalytics.sourceDistribution,
      timeline: dailyAnalytics.timeline,
      recentResults: recentResults.slice(0, 5), // Top 5 most recent
      hourlyTrend: hourlyAnalytics.timeline
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve dashboard data',
      message: error.message
    });
  }
};

exports.getSourceAnalytics = async (req, res) => {
  try {
    const { sourceType } = req.params;
    const { timeRange = 'day' } = req.query;

    if (!sourceType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Source type is required' 
      });
    }

    const analytics = await getAnalytics({ 
      timeRange, 
      source: sourceType 
    });

    res.json({
      success: true,
      data: analytics,
      sourceType
    });
  } catch (error) {
    console.error('Error getting source analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve source analytics',
      message: error.message
    });
  }
};

exports.compareSources = async (req, res) => {
  try {
    const { sources, timeRange = 'day' } = req.query;
    
    if (!sources) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sources parameter is required (comma-separated list)' 
      });
    }

    const sourceList = sources.split(',').map(s => s.trim());
    const comparisons = {};

    for (const source of sourceList) {
      try {
        comparisons[source] = await getAnalytics({ 
          timeRange, 
          source 
        });
      } catch (error) {
        console.error(`Error getting analytics for source ${source}:`, error);
        comparisons[source] = { error: error.message };
      }
    }

    res.json({
      success: true,
      data: comparisons,
      timeRange
    });
  } catch (error) {
    console.error('Error comparing sources:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to compare sources',
      message: error.message
    });
  }
};

module.exports = exports;