import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  const services = [
    {
      title: "Sentiment Analysis",
      description: "Advanced AI-powered sentiment analysis across multiple languages with real-time processing capabilities.",
      path: '/sentiment',
      tag: '#AI ANALYSIS'
    },
    {
      title: "Data Sources Integration", 
      description: "Connect seamlessly to social media platforms, APIs, and custom data streams for comprehensive monitoring.",
      path: '/data-sources',
      tag: '#DATA INTEGRATION'
    },
    {
      title: "Real-time Analytics",
      description: "Live monitoring dashboard with instant alerts, trend analysis, and actionable insights delivery.",
      path: '/analytics',
      tag: '#REAL-TIME MONITORING'
    },
    {
      title: "Custom Reporting",
      description: "Generate detailed reports with interactive charts, trends analysis, and export capabilities.",
      path: '/real-time',
      tag: '#REPORTING & INSIGHTS'
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-gray-900 leading-tight mb-8">
              Need to analyze sentiment but don't have enough <span className="font-semibold">AI expertise?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl leading-relaxed mb-10">
              Building AI sentiment analysis takes time—training models, processing data, and optimizing accuracy. We deliver a dedicated sentiment platform ready to use, so you get insights without the complexity.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/sentiment')}
                className="inline-flex items-center px-7 py-3 border border-gray-900 text-gray-900 text-sm font-medium rounded-none hover:bg-gray-900 hover:text-white transition-colors"
              >
                START ANALYZING
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="inline-flex items-center px-7 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-none hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                VIEW FEATURES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16">
            {services.map((service, index) => (
              <div 
                key={index}
                onClick={() => navigate(service.path)}
                className="group cursor-pointer"
              >
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-500 tracking-wide mb-4 block">
                        {service.tag}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 group-hover:text-gray-600 transition-colors">
                        {service.title}
                      </h2>
                    </div>
                    <div className="ml-8 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors">
                        <svg 
                          className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <button
              onClick={() => navigate('/analytics')}
              className="inline-flex items-center px-8 py-4 border border-gray-900 text-gray-900 text-lg font-medium rounded-none hover:bg-gray-900 hover:text-white transition-colors"
            >
              EXPLORE ALL FEATURES
            </button>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 tracking-wide mb-4 block">
                #CASE STUDY #SENTIMENT ANALYSIS
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Social Media Monitoring Platform
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">TECH STACK</span>
                  <span className="text-sm text-gray-600">React, Python, TensorFlow, AWS</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">TIMELINE</span>
                  <span className="text-sm text-gray-600">3 months</span>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="text-lg font-medium text-gray-900">+85% improvement in sentiment accuracy</div>
                <div className="text-lg font-medium text-gray-900">50% faster processing time</div>
                <div className="text-lg font-medium text-gray-900">Real-time analysis of 1M+ posts daily</div>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 text-sm font-medium rounded-none hover:bg-gray-900 hover:text-white transition-colors"
              >
                EXPLORE CASE STUDY
              </button>
            </div>
            <div className="lg:pl-16">
              <div className="bg-white p-8 border border-gray-200">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Live Sentiment Analysis</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Positive</span>
                      <span className="text-lg font-medium text-green-600">68.2%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2">
                      <div className="bg-green-500 h-2 w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Neutral</span>
                      <span className="text-lg font-medium text-gray-600">22.1%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2">
                      <div className="bg-gray-400 h-2 w-1/5"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Negative</span>
                      <span className="text-lg font-medium text-red-600">9.7%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2">
                      <div className="bg-red-500 h-2 w-1/12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed mb-8 max-w-4xl mx-auto">
            "We have seen a significant improvement in our sentiment analysis accuracy and the 
            general flow of data processing. This has contributed significantly to better 
            decision making across our organization."
          </blockquote>
          <div className="border-t border-gray-200 pt-8">
            <div className="text-lg font-medium text-gray-900">Sarah Chen</div>
            <div className="text-gray-600">Head of Data Analytics</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-8">
            Ready to transform your data into insights?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Start analyzing sentiment patterns, monitoring trends, and making data-driven decisions today.
          </p>
          <button
            onClick={() => navigate('/sentiment')}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-none hover:bg-gray-100 transition-colors"
          >
            GET STARTED NOW
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
