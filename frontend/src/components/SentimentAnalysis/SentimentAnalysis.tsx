import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleAnalyze();
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'warning';
      default:
        return 'default';
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Sentiment Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analyze Text
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Enter text to analyze sentiment... (Ctrl+Enter to analyze)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                margin="normal"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  {text.length} characters
                </Typography>
                
                <Button
                  variant="contained"
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>

              {!result && !loading && (
                <Box textAlign="center" py={4}>
                  <Typography color="textSecondary">
                    Enter text and click "Analyze" to see sentiment analysis results
                  </Typography>
                </Box>
              )}

              {loading && (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    Analyzing sentiment...
                  </Typography>
                </Box>
              )}

              {result && (
                <Box>
                  {/* Sentiment Result */}
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h2" mb={1}>
                      {getSentimentIcon(result.sentiment.sentiment)}
                    </Typography>
                    <Chip
                      label={`${result.sentiment.sentiment.toUpperCase()}`}
                      color={getSentimentColor(result.sentiment.sentiment) as any}
                      size="large"
                      sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Details */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Score
                      </Typography>
                      <Typography variant="h6">
                        {result.sentiment.score.toFixed(2)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Confidence
                      </Typography>
                      <Typography variant="h6">
                        {(result.sentiment.confidence * 100).toFixed(1)}%
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Language
                      </Typography>
                      <Typography variant="h6">
                        {result.language.toUpperCase()}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Method
                      </Typography>
                      <Typography variant="h6">
                        {result.sentiment.method || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Translation */}
                  {result.translation && (
                    <Box mt={3}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Translation (EN)
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{result.translation}"
                      </Typography>
                    </Box>
                  )}

                  {/* Original Text */}
                  <Box mt={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Original Text
                    </Typography>
                    <Typography variant="body1">
                      "{result.text}"
                    </Typography>
                  </Box>

                  {/* Warning */}
                  {result.warning && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {result.warning}
                    </Alert>
                  )}

                  {/* Timestamp */}
                  <Typography variant="caption" color="textSecondary" display="block" mt={2}>
                    Analyzed: {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How it works
              </Typography>
              <Typography variant="body1" paragraph>
                Our multilingual sentiment analysis system processes text through several steps:
              </Typography>
              <ol>
                <li><strong>Language Detection:</strong> Automatically identifies the language of your text</li>
                <li><strong>Translation:</strong> Translates non-English text to English for better analysis</li>
                <li><strong>Preprocessing:</strong> Cleans and normalizes the text</li>
                <li><strong>Sentiment Analysis:</strong> Analyzes emotional tone using multiple methods</li>
              </ol>
              <Typography variant="body2" color="textSecondary" mt={2}>
                The system supports multiple languages and provides confidence scores for reliability assessment.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SentimentAnalysis;