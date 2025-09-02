import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DataCollection = () => {
  const [selectedSources, setSelectedSources] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const dataSources = [
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Analyze comments and engagement from YouTube videos',
      icon: '🎥',
      color: 'from-red-500 to-red-600',
      popularity: '95%'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Real-time sentiment from tweets and social conversations',
      icon: '🐦',
      color: 'from-blue-500 to-blue-600',
      popularity: '89%'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      description: 'Community discussions and thread sentiment analysis',
      icon: '🔴',
      color: 'from-orange-500 to-orange-600',
      popularity: '78%'
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Monitor chat sentiment in real-time communities',
      icon: '💬',
      color: 'from-indigo-500 to-indigo-600',
      popularity: '67%'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Analyze group conversations and channel messages',
      icon: '✈️',
      color: 'from-blue-400 to-blue-500',
      popularity: '56%'
    },
    {
      id: 'news',
      name: 'News APIs',
      description: 'Monitor news sentiment across multiple sources',
      icon: '📰',
      color: 'from-gray-500 to-gray-600',
      popularity: '72%'
    }
  ];

  const toggleSource = (sourceId) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleConnect = async () => {
    if (selectedSources.length === 0) return;
    
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Connect Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Data Sources
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the platforms you want to analyze. Our AI will start processing sentiment data from your selected sources in real-time.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-600">Welcome</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Data Collection</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm text-gray-600">Analytics</span>
              </div>
            </div>
          </div>

          {/* Data Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {dataSources.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              return (
                <div
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${source.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300 ${
                    isSelected ? 'opacity-75' : ''
                  }`}></div>
                  <div className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-500 shadow-xl' 
                      : 'border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
                  }`}>
                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className={`w-12 h-12 bg-gradient-to-r ${source.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {source.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{source.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{source.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-500">Active</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{source.popularity} popular</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configuration Panel */}
          {selectedSources.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Configure Selected Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Frequency
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Real-time (recommended)</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Hourly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages to Monitor
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All supported languages</option>
                    <option>English only</option>
                    <option>English + Spanish</option>
                    <option>Custom selection</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 text-gray-600 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleConnect}
              disabled={selectedSources.length === 0 || isConnecting}
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                selectedSources.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              }`}
            >
              {isConnecting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting...
                </div>
              ) : (
                `Connect ${selectedSources.length} Source${selectedSources.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {selectedSources.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Select at least one data source to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCollection;