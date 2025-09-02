import React, { useState } from 'react';
import Page from '../Common/Page.jsx';

const DataSources = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const sources = [
    { 
      name: 'YouTube', 
      desc: 'Live chat & comments analysis', 
      status: 'Connected',
      icon: '🎥',
      lastUpdate: '2 minutes ago',
      totalAnalyzed: '1.2M',
      avgSentiment: '+0.42',
      apiKey: 'yt_api_key_*****',
      color: 'from-red-500 to-red-600'
    },
    { 
      name: 'Twitter/X', 
      desc: 'Tweets & threads monitoring', 
      status: 'Disconnected',
      icon: '🐦',
      lastUpdate: 'Never',
      totalAnalyzed: '0',
      avgSentiment: 'N/A',
      apiKey: 'Not configured',
      color: 'from-blue-400 to-blue-500'
    },
    { 
      name: 'Reddit', 
      desc: 'Posts & comments tracking', 
      status: 'Connected',
      icon: '📱',
      lastUpdate: '5 minutes ago',
      totalAnalyzed: '856K',
      avgSentiment: '+0.21',
      apiKey: 'reddit_key_*****',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Twitch', 
      desc: 'Live chat stream analysis', 
      status: 'Disconnected',
      icon: '🎮',
      lastUpdate: 'Never',
      totalAnalyzed: '0',
      avgSentiment: 'N/A',
      apiKey: 'Not configured',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Discord', 
      desc: 'Server messages monitoring', 
      status: 'Connected',
      icon: '💬',
      lastUpdate: '1 minute ago',
      totalAnalyzed: '432K',
      avgSentiment: '+0.18',
      apiKey: 'discord_bot_*****',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'Telegram', 
      desc: 'Channel & group analysis', 
      status: 'Disconnected',
      icon: '✈️',
      lastUpdate: 'Never',
      totalAnalyzed: '0',
      avgSentiment: 'N/A',
      apiKey: 'Not configured',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const handleConnect = async (source) => {
    setIsConnecting(true);
    setSelectedSource(source);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      console.log(`Connecting to ${source.name}`);
      // Update source status logic would go here
    }, 2000);
  };

  const getStatusColor = (status) => {
    return status === 'Connected' 
      ? 'text-green-400 bg-green-500/20 border-green-500/30' 
      : 'text-orange-400 bg-orange-500/20 border-orange-500/30';
  };

  const connectedSources = sources.filter(s => s.status === 'Connected').length;
  const totalSources = sources.length;

  return (
    <Page
      title="Data Sources"
      subtitle="Connect and manage data sources for real-time multilingual sentiment analysis across platforms."
      actions={
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="text-slate-400 text-sm">Connected: </span>
            <span className="text-white font-medium">{connectedSources}/{totalSources}</span>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Source
            </div>
          </button>
        </div>
      }
    >
      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Sources', value: connectedSources, icon: '🔗', color: 'from-green-500 to-teal-500' },
          { label: 'Total Analyzed', value: '2.5M+', icon: '📊', color: 'from-blue-500 to-cyan-500' },
          { label: 'Avg Processing', value: '1.2s', icon: '⚡', color: 'from-purple-500 to-pink-500' }
        ].map((stat, index) => (
          <div key={index} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sources.map((source, index) => (
          <div key={source.name} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${source.color} rounded-xl flex items-center justify-center text-2xl mr-3`}>
                    {source.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{source.name}</h3>
                    <p className="text-slate-400 text-sm">{source.desc}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>

              {/* Stats */}
              {source.status === 'Connected' && (
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Analyzed:</span>
                    <span className="text-white font-medium">{source.totalAnalyzed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Sentiment:</span>
                    <span className={`font-medium ${parseFloat(source.avgSentiment) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {source.avgSentiment}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Update:</span>
                    <span className="text-cyan-400">{source.lastUpdate}</span>
                  </div>
                </div>
              )}

              {/* API Key */}
              <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">API Key:</span>
                  <code className="text-slate-300 text-xs font-mono">{source.apiKey}</code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {source.status === 'Connected' ? (
                  <>
                    <button className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm font-medium rounded-lg transition-colors">
                      Configure
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg border border-red-500/30 transition-colors">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(source)}
                    disabled={isConnecting && selectedSource?.name === source.name}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isConnecting && selectedSource?.name === source.name ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Connecting...
                      </div>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>

              {/* Real-time indicator for connected sources */}
              {source.status === 'Connected' && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Guide */}
      <div className="mt-12 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Setup Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose Platform', desc: 'Select the social media platform you want to analyze' },
              { step: '2', title: 'Get API Keys', desc: 'Obtain API credentials from the platform\'s developer portal' },
              { step: '3', title: 'Configure Source', desc: 'Enter your API keys and configure analysis parameters' },
              { step: '4', title: 'Start Analyzing', desc: 'Begin real-time sentiment analysis and monitoring' }
            ].map((guide, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {guide.step}
                </div>
                <h4 className="text-white font-semibold mb-2">{guide.title}</h4>
                <p className="text-slate-400 text-sm">{guide.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DataSources;