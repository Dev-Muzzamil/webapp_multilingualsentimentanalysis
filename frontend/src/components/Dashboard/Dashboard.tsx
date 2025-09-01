import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Language as LanguageIcon,
  DataUsage as DataUsageIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock data for now
  const mockData = {
    overview: {
      totalToday: 0,
      totalLastHour: 0,
      averageScoreToday: 0,
      averageScoreLastHour: 0,
    },
    sentimentDistribution: {
      positive: 0,
      negative: 0,
      neutral: 0,
    },
    languageDistribution: {},
    sourceDistribution: {},
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.03)',
                boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ opacity: 0.85 }} gutterBottom>
                    Total Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {mockData.overview.totalToday}
                  </Typography>
                </Box>
                <PsychologyIcon sx={{ fontSize: 44, opacity: 0.85 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f472b6 0%, #fbcfe8 100%)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 rgba(244,114,182,0.10)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.03)',
                boxShadow: '0 8px 32px 0 rgba(244,114,182,0.18)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ opacity: 0.85 }} gutterBottom>
                    Last Hour
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {mockData.overview.totalLastHour}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 44, opacity: 0.85 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #34d399 0%, #a7f3d0 100%)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 rgba(52,211,153,0.10)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.03)',
                boxShadow: '0 8px 32px 0 rgba(52,211,153,0.18)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ opacity: 0.85 }} gutterBottom>
                    Avg Score Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {mockData.overview.averageScoreToday.toFixed(2)}
                  </Typography>
                </Box>
                <LanguageIcon sx={{ fontSize: 44, opacity: 0.85 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #bae6fd 100%)',
              color: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 24px 0 rgba(56,189,248,0.10)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.03)',
                boxShadow: '0 8px 32px 0 rgba(56,189,248,0.18)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ opacity: 0.85 }} gutterBottom>
                    Data Sources
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Object.keys(mockData.sourceDistribution).length}
                  </Typography>
                </Box>
                <DataUsageIcon sx={{ fontSize: 44, opacity: 0.85 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Information Card */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to Multilingual Sentiment Analysis
            </Typography>
            <Typography variant="body1" paragraph>
              This dashboard will show analytics and insights from your sentiment analysis activities. 
              To get started:
            </Typography>
            <ol>
              <li>Go to the <strong>Sentiment Analysis</strong> page to analyze individual texts</li>
              <li>Use <strong>Data Sources</strong> to connect and analyze data from social media platforms</li>
              <li>Monitor real-time sentiment with the <strong>Real-time Monitor</strong></li>
              <li>View detailed <strong>Analytics</strong> and trends</li>
            </ol>
            <Typography variant="body2" color="textSecondary" mt={2}>
              Note: The backend server needs to be running and properly configured for full functionality.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;