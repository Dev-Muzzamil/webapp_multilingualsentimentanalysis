import React, { useState, useEffect } from 'react';
import Page from '../Common/Page.jsx';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('sentiment');
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const metrics = [
    {
      id: 'sentiment',
      title: 'Sentiment Analysis',
      value: '124,582',
      change: '+12.5%',
      trend: 'up',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'confidence',
      title: 'Avg. Confidence',
      value: '92.4%',
      change: '+2.1%',
      trend: 'up',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'processing',
      title: 'Processing Time',
      value: '480ms',
      change: '-15.3%',
      trend: 'down',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'throughput',
      title: 'Throughput',
      value: '2.1k/min',
      change: '+8.7%',
      trend: 'up',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const sentimentData = [
    { label: 'Positive', value: 68.2, color: 'bg-green-400' },
    { label: 'Neutral', value: 22.1, color: 'bg-yellow-400' },
    { label: 'Negative', value: 9.7, color: 'bg-red-400' }
  ];

  const languageData = [
    { label: 'English', value: 45.2, color: 'bg-cyan-400' },
    { label: 'Spanish', value: 23.1, color: 'bg-purple-400' },
    { label: 'French', value: 15.8, color: 'bg-pink-400' },
    { label: 'Hindi', value: 12.4, color: 'bg-blue-400' },
    { label: 'Others', value: 3.5, color: 'bg-slate-400' }
  ];

  const sourceData = [
    { label: 'YouTube', value: 42.3, posts: '1.2M', color: 'bg-red-500' },
    { label: 'Twitter', value: 28.7, posts: '856k', color: 'bg-blue-400' },
    { label: 'Reddit', value: 18.5, posts: '432k', color: 'bg-orange-500' },
    { label: 'Discord', value: 10.5, posts: '287k', color: 'bg-indigo-500' }
  ];

  const recentInsights = [
    {
      type: 'trend',
      title: 'Positive sentiment spike detected',
      description: 'YouTube comments showing 15% increase in positive sentiment',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      type: 'warning',
      title: 'Processing delay on Twitter feed',
      description: 'Temporary slowdown in Twitter data processing',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      type: 'info',
      title: 'New language support added',
      description: 'Portuguese language analysis now available',
      time: '1 day ago',
      priority: 'low'
    }
  ];

  const handleExport = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Export completed');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzlDOTJBQyIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiI+PC9jaXJjbGU+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative">
        {/* Header Section */}
        <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-slate-300">
                  Explore performance metrics, trends, and insights from your sentiment pipelines
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center gap-4">
                {/* Time Range Selector */}
                <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        timeRange === range.value
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Exporting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Report
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 cursor-pointer"
                       onClick={() => setSelectedMetric(metric.id)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <svg className={`w-4 h-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-slate-400">{metric.title}</div>
                    {selectedMetric === metric.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts and Data Visualization */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sentiment Distribution */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
                    Sentiment Distribution
                  </h3>
                  <div className="space-y-4">
                    {sentimentData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 ${item.color} rounded-full mr-3`}></div>
                          <span className="text-slate-300">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-slate-700 rounded-full mr-3">
                            <div 
                              className={`h-2 ${item.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium min-w-[3rem]">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language Distribution */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
                    Language Distribution
                  </h3>
                  <div className="space-y-4">
                    {languageData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 ${item.color} rounded-full mr-3`}></div>
                          <span className="text-slate-300">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-slate-700 rounded-full mr-3">
                            <div 
                              className={`h-2 ${item.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium min-w-[3rem]">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sources and Insights */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Data Sources Performance */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                    Data Sources Performance
                  </h3>
                  <div className="space-y-4">
                    {sourceData.map((source, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 ${source.color} rounded-full mr-3`}></div>
                            <span className="text-white font-medium">{source.label}</span>
                          </div>
                          <span className="text-slate-400 text-sm">{source.posts} posts</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full">
                          <div 
                            className={`h-2 ${source.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${source.value}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-white font-medium">{source.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Insights */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-3"></div>
                    Recent Insights
                  </h3>
                  <div className="space-y-4">
                    {recentInsights.map((insight, index) => (
                      <div key={index} className={`p-4 rounded-xl border-l-4 ${
                        insight.priority === 'high' ? 'bg-red-500/10 border-red-500' :
                        insight.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                        'bg-blue-500/10 border-blue-500'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                            <p className="text-slate-400 text-sm mb-2">{insight.description}</p>
                            <span className="text-slate-500 text-xs">{insight.time}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            insight.priority === 'high' ? 'bg-red-400' :
                            insight.priority === 'medium' ? 'bg-yellow-400' :
                            'bg-blue-400'
                          } animate-pulse`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;