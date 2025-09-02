import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedView, setSelectedView] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ];

  const views = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sentiment', name: 'Sentiment', icon: '😊' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'sources', name: 'Sources', icon: '🔗' }
  ];

  const kpiMetrics = [
    {
      title: 'Total Messages',
      value: '2.4M',
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      icon: '💬'
    },
    {
      title: 'Positive Sentiment',
      value: '68.2%',
      change: '+5.3%',
      trend: 'up',
      color: 'from-green-500 to-green-600',
      icon: '😊'
    },
    {
      title: 'Processing Speed',
      value: '480ms',
      change: '-15.3%',
      trend: 'down',
      color: 'from-purple-500 to-purple-600',
      icon: '⚡'
    },
    {
      title: 'Accuracy Rate',
      value: '94.7%',
      change: '+2.1%',
      trend: 'up',
      color: 'from-orange-500 to-orange-600',
      icon: '🎯'
    }
  ];

  // Chart Data Components
  const SentimentChart = () => {
    const sentimentData = [
      { label: 'Positive', value: 68.2, color: 'bg-green-500', textColor: 'text-green-600' },
      { label: 'Neutral', value: 22.1, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
      { label: 'Negative', value: 9.7, color: 'bg-red-500', textColor: 'text-red-600' }
    ];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Sentiment Distribution</h3>
        <div className="space-y-6">
          {sentimentData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className={`${item.textColor} font-bold`}>{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${item.color} h-3 rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: `${item.value}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LanguageChart = () => {
    const languageData = [
      { label: 'English', value: 45.2, color: 'bg-blue-500' },
      { label: 'Spanish', value: 23.1, color: 'bg-purple-500' },
      { label: 'French', value: 15.8, color: 'bg-pink-500' },
      { label: 'Hindi', value: 12.4, color: 'bg-indigo-500' },
      { label: 'Others', value: 3.5, color: 'bg-gray-500' }
    ];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Language Distribution</h3>
        <div className="relative w-64 h-64 mx-auto">
          {/* Simple pie chart representation */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {languageData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="ml-auto text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TrendChart = () => {
    const trendData = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      positive: 60 + Math.random() * 20,
      negative: 10 + Math.random() * 10,
      neutral: 20 + Math.random() * 15
    }));

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">7-Day Sentiment Trend</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {trendData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col space-y-1">
                <div 
                  className="bg-green-500 rounded-t"
                  style={{ height: `${day.positive * 2}px` }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ height: `${day.neutral * 2}px` }}
                ></div>
                <div 
                  className="bg-red-500 rounded-b"
                  style={{ height: `${day.negative * 2}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Negative</span>
          </div>
        </div>
      </div>
    );
  };

  const SourcesChart = () => {
    const sourceData = [
      { name: 'YouTube', value: 42.3, posts: '1.2M', color: 'bg-red-500', icon: '🎥' },
      { name: 'Twitter/X', value: 28.7, posts: '856K', color: 'bg-blue-500', icon: '🐦' },
      { name: 'Reddit', value: 18.5, posts: '432K', color: 'bg-orange-500', icon: '🔴' },
      { name: 'Discord', value: 10.5, posts: '287K', color: 'bg-indigo-500', icon: '💬' }
    ];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Sources Performance</h3>
        <div className="space-y-4">
          {sourceData.map((source, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{source.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{source.name}</div>
                    <div className="text-sm text-gray-600">{source.posts} messages</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">{source.value}%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${source.color} h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${source.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HeatmapChart = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Heatmap</h3>
        <div className="space-y-1">
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center space-x-1">
              <div className="w-8 text-xs text-gray-600">{day}</div>
              <div className="flex space-x-1">
                {hours.map((hour) => {
                  const intensity = Math.random();
                  const colorClass = 
                    intensity > 0.7 ? 'bg-blue-600' :
                    intensity > 0.5 ? 'bg-blue-400' :
                    intensity > 0.3 ? 'bg-blue-200' :
                    'bg-gray-100';
                  
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`w-3 h-3 rounded-sm ${colorClass} transition-all duration-300 hover:scale-125`}
                      title={`${day} ${hour}:00 - ${Math.round(intensity * 100)}% activity`}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Low activity</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          </div>
          <span>High activity</span>
        </div>
      </div>
    );
  };

  const BubbleChart = () => {
    const bubbleData = [
      { name: 'Product Reviews', x: 75, y: 85, size: 60, color: 'bg-blue-500' },
      { name: 'Customer Support', x: 45, y: 95, size: 40, color: 'bg-green-500' },
      { name: 'Social Media', x: 90, y: 60, size: 80, color: 'bg-purple-500' },
      { name: 'News Articles', x: 30, y: 70, size: 30, color: 'bg-orange-500' },
      { name: 'Forum Posts', x: 65, y: 45, size: 50, color: 'bg-pink-500' }
    ];

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Sentiment vs Confidence Bubble Chart</h3>
        <div className="relative h-64 bg-gray-50 rounded-xl overflow-hidden">
          {bubbleData.map((bubble, index) => (
            <div
              key={index}
              className={`absolute ${bubble.color} rounded-full opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                transform: 'translate(-50%, -50%)'
              }}
              title={bubble.name}
            >
              <span className="text-white text-xs font-medium text-center px-1">
                {bubble.name.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-600">
          <span>Sentiment Score →</span>
          <span>↑ Confidence Level</span>
        </div>
      </div>
    );
  };

  const MetricsGauge = () => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Gauges</h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Processing Speed', value: 87, color: 'text-blue-600' },
            { label: 'Accuracy', value: 94, color: 'text-green-600' },
            { label: 'Throughput', value: 76, color: 'text-purple-600' },
            { label: 'Uptime', value: 99, color: 'text-orange-600' }
          ].map((gauge, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={gauge.color}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${gauge.value}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${gauge.color}`}>{gauge.value}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-700">{gauge.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Analytics{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Real-time insights and performance metrics from your sentiment analysis pipeline
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={() => setIsLoading(!isLoading)}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {metric.icon}
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className={`w-4 h-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-gray-600">{metric.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <SentimentChart />
            <LanguageChart />
            <TrendChart />
            <SourcesChart />
            <HeatmapChart />
            <BubbleChart />
            <div className="xl:col-span-1">
              <MetricsGauge />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;