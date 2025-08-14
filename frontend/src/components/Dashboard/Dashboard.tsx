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
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Today
                  </Typography>
                  <Typography variant="h4">
                    {mockData.overview.totalToday}
                  </Typography>
                </Box>
                <PsychologyIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Last Hour
                  </Typography>
                  <Typography variant="h4">
                    {mockData.overview.totalLastHour}
                  </Typography>
                </Box>
                <TrendingUpIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Score Today
                  </Typography>
                  <Typography variant="h4">
                    {mockData.overview.averageScoreToday.toFixed(2)}
                  </Typography>
                </Box>
                <LanguageIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Data Sources
                  </Typography>
                  <Typography variant="h4">
                    {Object.keys(mockData.sourceDistribution).length}
                  </Typography>
                </Box>
                <DataUsageIcon color="info" sx={{ fontSize: 40 }} />
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