import React, { useState } from 'react';
import Page from '../Common/Page';

interface SentimentResult {
  text: string;
  language: string;
  translation?: string;
  sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    method?: string;
  };
  timestamp: string;
  processingTime?: number;
  id?: string;
  warning?: string;
}

const SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Call the backend API
      const response = await fetch('http://localhost:5000/api/sentiment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error('Failed to analyze sentiment');
      }
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError('Failed to analyze sentiment. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '🤔';
    }
  };

  return (
    <Page
      title="Sentiment Analysis"
      subtitle="Analyze the emotional tone of your text using advanced AI models that support multiple languages."
      actions={
        <button onClick={handleAnalyze} disabled={loading || !text.trim()} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Analyze</button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enter Text to Analyze</h2>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter text to analyze sentiment... (Supports multiple languages)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600">{error}</p></div>
          )}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">{text.length} characters</span>
            <button onClick={handleAnalyze} disabled={loading || !text.trim()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2">
              {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Analyzing...</>) : (<>Analyze</>)}
            </button>
          </div>
        </div>
        <div className="border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
          {!result && !loading && (
            <div className="text-center py-12"><div className="text-6xl mb-4">🤖</div><p className="text-gray-500">Enter text and click "Analyze" to see results</p></div>
          )}
          {loading && (
            <div className="text-center py-12"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600">Analyzing sentiment...</p></div>
          )}
          {result && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{getSentimentIcon(result.sentiment.sentiment)}</div>
                <span className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold text-lg ${getSentimentColor(result.sentiment.sentiment)}`}>
                  {result.sentiment.sentiment.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600 mb-1">Score</p><p className="text-2xl font-bold text-gray-900">{result.sentiment.score.toFixed(2)}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600 mb-1">Confidence</p><p className="text-2xl font-bold text-gray-900">{(result.sentiment.confidence * 100).toFixed(1)}%</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600 mb-1">Language</p><p className="text-xl font-semibold text-gray-900">{result.language.toUpperCase()}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600 mb-1">Method</p><p className="text-xl font-semibold text-gray-900">{result.sentiment.method || 'AI Model'}</p></div>
              </div>
              {result.translation && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"><p className="text-sm text-blue-600 font-medium mb-2">Translation (EN)</p><p className="text-gray-900 italic">"{result.translation}"</p></div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600 font-medium mb-2">Original Text</p><p className="text-gray-900">"{result.text}"</p></div>
              {result.warning && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"><p className="text-yellow-800">{result.warning}</p></div>
              )}
              <p className="text-sm text-gray-500 text-center">Analyzed: {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default SentimentAnalysis;