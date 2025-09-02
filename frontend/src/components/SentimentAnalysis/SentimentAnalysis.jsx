import React, { useState, useEffect } from 'react';
import Page from '../Common/Page.jsx';

const SentimentAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState('advanced');

  const languages = [
    { code: 'auto', name: 'Auto-Detect', flag: '🌍' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];

  const models = [
    { id: 'advanced', name: 'Advanced AI', desc: 'High accuracy, multilingual support', accuracy: '94%' },
    { id: 'fast', name: 'Fast Analysis', desc: 'Quick processing, good accuracy', accuracy: '89%' },
    { id: 'enterprise', name: 'Enterprise', desc: 'Maximum accuracy, all features', accuracy: '97%' }
  ];

  const exampleTexts = [
    "I absolutely love this new product! It's amazing!",
    "This service is terrible and disappointing.",
    "The weather is nice today, nothing special.",
    "¡Este producto es increíble! Me encanta mucho.",
    "यह बहुत अच्छा उत्पाद है। मुझे यह पसंद है।",
    "Ce service est vraiment excellent et professionnel."
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        text: inputText,
        language: selectedLanguage === 'auto' ? 'en' : selectedLanguage,
        sentiment: Math.random() > 0.5 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        score: (Math.random() * 2 - 1).toFixed(3),
        processingTime: Math.floor(Math.random() * 500 + 200),
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);
      setAnalysisHistory(prev => [mockResult, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleExampleClick = (example) => {
    setInputText(example);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'from-green-500 to-teal-500';
      case 'negative': return 'from-red-500 to-pink-500';
      default: return 'from-yellow-500 to-orange-500';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  return (
    <Page
      title="Sentiment Analysis"
      subtitle="Analyze sentiment across multiple languages with advanced AI-powered processing capabilities."
      actions={
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="text-slate-400 text-sm">Model: </span>
            <span className="text-white font-medium">{models.find(m => m.id === selectedModel)?.name}</span>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Batch Analysis
            </div>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
                Text Analysis
              </h3>

              {/* Model Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Analysis Model</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        selectedModel === model.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-white'
                          : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:border-slate-500/50'
                      }`}
                    >
                      <div className="text-sm font-medium">{model.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{model.desc}</div>
                      <div className="text-xs text-cyan-400 mt-1">{model.accuracy} accuracy</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Text to Analyze</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to analyze sentiment... (supports multiple languages)"
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-right text-slate-400 text-sm">
                  {inputText.length} characters
                </div>
              </div>

              {/* Example Texts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Quick Examples</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {exampleTexts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="p-3 text-left bg-slate-700/30 hover:bg-slate-600/30 border border-slate-600/30 rounded-lg text-slate-300 text-sm transition-colors"
                    >
                      "{example.substring(0, 50)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze Sentiment
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  Analysis Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${getSentimentColor(result.sentiment)}/20 border border-current/30`}>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl">{getSentimentIcon(result.sentiment)}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold capitalize">{result.sentiment}</div>
                      <div className="text-slate-300 text-sm">Sentiment</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{(result.confidence * 100).toFixed(1)}%</div>
                      <div className="text-slate-300 text-sm">Confidence</div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{result.score}</div>
                      <div className="text-slate-300 text-sm">Score</div>
                      <div className="text-xs text-slate-400 mt-1">
                        (-1.0 to +1.0)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Language:</span>
                    <span className="text-white ml-2 font-medium">{result.language.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Processing Time:</span>
                    <span className="text-white ml-2 font-medium">{result.processingTime}ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Analysis History */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
                Recent Analysis
              </h3>
              
              {analysisHistory.length > 0 ? (
                <div className="space-y-3">
                  {analysisHistory.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                          item.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                          item.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.sentiment}
                        </span>
                        <span className="text-slate-400 text-xs">{item.confidence * 100}%</span>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">
                        "{item.text.substring(0, 80)}..."
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No analysis history yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips & Info */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
                Tips & Features
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: '🌍', title: 'Multilingual', desc: 'Supports 50+ languages with auto-detection' },
                  { icon: '⚡', title: 'Real-time', desc: 'Instant analysis with sub-second processing' },
                  { icon: '🎯', title: 'High Accuracy', desc: 'Advanced AI models with 97% accuracy' },
                  { icon: '📊', title: 'Detailed Metrics', desc: 'Confidence scores and processing insights' }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-xl">{tip.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{tip.title}</h4>
                      <p className="text-slate-400 text-xs">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SentimentAnalysis;