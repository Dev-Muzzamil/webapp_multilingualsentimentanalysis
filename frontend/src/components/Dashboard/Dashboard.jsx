import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: '2.4k',
    avgSentiment: '74.2%',
    activeStreams: '12',
    uptime: '99.9%'
  });
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  const quickActions = [
    {
      title: "Start Analysis",
      description: "Begin real-time sentiment analysis",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      action: () => navigate('/sentiment'),
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: "Connect Sources", 
      description: "Add new data sources",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      action: () => navigate('/data-sources'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: "View Analytics",
      description: "Explore detailed insights",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => navigate('/analytics'),
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: "Real-time Monitor",
      description: "Watch live sentiment streams",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      action: () => navigate('/real-time'),
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivity = [
    { text: "YouTube analysis completed", time: "2 minutes ago", type: "success" },
    { text: "Twitter stream connected", time: "5 minutes ago", type: "info" },
    { text: "New sentiment threshold set", time: "1 hour ago", type: "warning" },
    { text: "Daily report generated", time: "2 hours ago", type: "success" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzlDOTJBQyIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiI+PC9jaXJjbGU+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative">
        {/* Header Section */}
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SentimentAI
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Advanced multilingual sentiment analysis platform with real-time processing and AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Analyses', value: stats.totalAnalyses, icon: '📊', color: 'from-cyan-500 to-blue-500' },
                { label: 'Avg Sentiment', value: stats.avgSentiment, icon: '😊', color: 'from-green-500 to-teal-500' },
                { label: 'Active Streams', value: stats.activeStreams, icon: '🔴', color: 'from-purple-500 to-pink-500' },
                { label: 'System Uptime', value: stats.uptime, icon: '⚡', color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {stat.icon}
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-4"></span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.action}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-slate-400 text-sm">{action.description}</p>
                    <div className="mt-4 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span className="text-sm font-medium">Get started</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Live Status */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            activity.type === 'success' ? 'bg-green-400' :
                            activity.type === 'info' ? 'bg-blue-400' :
                            activity.type === 'warning' ? 'bg-yellow-400' : 'bg-slate-400'
                          }`}></div>
                          <span className="text-slate-300">{activity.text}</span>
                        </div>
                        <span className="text-slate-500 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Sentiment Monitoring */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-3"></div>
                    Live Sentiment
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Positive</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-16 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-green-400 font-medium">68.2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Neutral</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-6 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                        <span className="text-yellow-400 font-medium">22.1%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Negative</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-700 rounded-full mr-3">
                          <div className="w-3 h-2 bg-red-400 rounded-full"></div>
                        </div>
                        <span className="text-red-400 font-medium">9.7%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Live Processing</span>
                      <span className="text-cyan-400 font-medium">1,247 messages/min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to transform your data into insights?
                </h2>
                <p className="text-slate-300 mb-8 text-lg">
                  Start analyzing sentiment patterns, monitoring trends, and making data-driven decisions today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/sentiment')}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Start Analyzing
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-200 transform hover:scale-105"
                  >
                    View Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;