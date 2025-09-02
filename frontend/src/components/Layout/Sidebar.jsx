import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
        </svg>
      ), 
      path: '/' 
    },
    { 
      text: 'Sentiment Analysis', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), 
      path: '/sentiment' 
    },
    { 
      text: 'Data Sources', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ), 
      path: '/data-sources' 
    },
    { 
      text: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      path: '/analytics' 
    },
    { 
      text: 'Real-time Monitor', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ), 
      path: '/real-time',
      hasNotification: true
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SentimentAI</h2>
              <p className="text-xs text-slate-400 font-medium">AI Analytics Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`flex-shrink-0 mr-3 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.text}</span>
                  {item.hasNotification && (
                    <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 font-medium">SYSTEM ONLINE</span>
            </div>
            <div className="text-xs text-slate-500">All services operational</div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">CPU Usage</span>
                <span className="text-cyan-400">23%</span>
              </div>
              <div className="w-full h-1 bg-slate-700 rounded-full mt-1">
                <div className="w-1/4 h-1 bg-cyan-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Section for Mobile */}
        <div className="absolute bottom-24 left-0 right-0 p-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigation('/login')}
              className="w-full px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation('/signup')}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;