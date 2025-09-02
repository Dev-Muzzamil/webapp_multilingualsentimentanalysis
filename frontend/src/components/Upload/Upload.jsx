import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState('sentiment');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(file => {
      const validTypes = ['text/plain', 'text/csv', 'application/json', 'application/vnd.ms-excel'];
      return validTypes.includes(file.type) || file.name.endsWith('.xlsx');
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    navigate('/analytics?source=upload');
  };

  const analysisTypes = [
    {
      id: 'sentiment',
      name: 'Sentiment Analysis',
      description: 'Analyze emotional tone and sentiment polarity',
      icon: '😊'
    },
    {
      id: 'emotion',
      name: 'Emotion Detection',
      description: 'Detect specific emotions like joy, anger, fear, etc.',
      icon: '🎭'
    },
    {
      id: 'topic',
      name: 'Topic Modeling',
      description: 'Identify main topics and themes in text',
      icon: '🏷️'
    },
    {
      id: 'language',
      name: 'Language Detection',
      description: 'Automatically detect text language',
      icon: '🌐'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upload &{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Process Files
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your text files, CSV data, or JSON documents for custom sentiment analysis and insights.
            </p>
          </div>

          {/* Analysis Type Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Choose Analysis Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setAnalysisType(type.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    analysisType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{type.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Upload Files</h3>
            
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.csv,.json,.xlsx"
                onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Drop files here or click to browse
                  </h4>
                  <p className="text-gray-600">
                    Supports: TXT, CSV, JSON, Excel files
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Select Files
                </button>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Files ({files.length})
                </h4>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📄</div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Processing Options */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Processing Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Detection
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Auto-detect</option>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>JSON Report</option>
                  <option>CSV Export</option>
                  <option>PDF Summary</option>
                  <option>Excel Dashboard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/collect')}
              className="px-8 py-4 text-gray-600 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Back to Collection
            </button>
            <button
              onClick={processFiles}
              disabled={files.length === 0 || processing}
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                files.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              }`}
            >
              {processing ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Process ${files.length} File${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {files.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Upload files to start processing
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;