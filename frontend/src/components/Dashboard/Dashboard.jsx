import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const features = [
    {
      title: 'Real-time Analysis',
      description: 'Process sentiment data as it flows in from multiple sources',
      icon: '⚡',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Multi-language Support',
      description: 'Analyze sentiment in 50+ languages with AI precision',
      icon: '🌐',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep insights with visual dashboards and reporting',
      icon: '📊',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 compliance',
      icon: '🔒',
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { label: '10M+', value: 'Messages Analyzed', icon: '📈' },
    { label: '50+', value: 'Languages Supported', icon: '🗣️' },
    { label: '99.9%', value: 'Uptime Guarantee', icon: '⚡' },
    { label: '24/7', value: 'Expert Support', icon: '🎧' }
  ];

  const workflow = [
    {
      step: '01',
      title: 'Connect Sources',
      description: 'Link your social media, review platforms, and data feeds',
      icon: '🔗',
      path: '/collect'
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'Our advanced AI analyzes sentiment across all languages',
      icon: '🤖',
      path: '/analytics'
    },
    {
      step: '03',
      title: 'Get Insights',
      description: 'View real-time dashboards and automated reports',
      icon: '💡',
      path: '/analytics'
    },
    {
      step: '04',
      title: 'Take Action',
      description: 'Make data-driven decisions with confidence',
      icon: '🎯',
      path: '/account'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                🚀 Now supporting 50+ languages
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transform{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Sentiment
              </span>
              <br />
              Into Business Value
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Advanced multilingual sentiment analysis platform that turns your customer conversations 
              into actionable insights with real-time AI processing.
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/collect')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Analysis
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="px-8 py-4 text-gray-700 font-semibold border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 rounded-xl transition-all duration-300"
              >
                View Live Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center text-gray-500 mb-8">
              Trusted by 500+ companies worldwide
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-gray-600 font-medium">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SentimentAI
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade sentiment analysis with the simplicity your team needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Started in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to insights in minutes, not months
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <div
                key={index}
                onClick={() => navigate(step.path)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Connect arrows for larger screens */}
                  {index < workflow.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-75"></div>
            <div className="relative bg-white rounded-3xl p-12 border border-gray-200">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Data?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of companies using SentimentAI to understand their customers better and make smarter business decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/collect')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Free Trial
                </button>
                <button
                  onClick={() => navigate('/account')}
                  className="px-8 py-4 text-gray-700 font-semibold border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 rounded-xl transition-all duration-300"
                >
                  Contact Sales
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;