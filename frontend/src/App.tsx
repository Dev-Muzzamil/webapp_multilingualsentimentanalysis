import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import './App.css';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import SentimentAnalysis from './components/SentimentAnalysis/SentimentAnalysis';
import DataSources from './components/DataSources/DataSources';
import Analytics from './components/Analytics/Analytics';
import RealTimeMonitor from './components/RealTime/RealTimeMonitor';

// Modern, aesthetic MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5B9DF9', // Soft blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#A78BFA', // Soft purple
      contrastText: '#fff',
    },
    background: {
      default: '#F4F6FB', // Very light blue-gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#232946', // Deep blue-gray
      secondary: '#6B7280', // Subtle gray
    },
    success: {
      main: '#6EE7B7', // Soft green
    },
    info: {
      main: '#38BDF8', // Soft cyan
    },
    warning: {
      main: '#FBBF24', // Soft yellow
    },
    error: {
      main: '#F472B6', // Soft pink
    },
    divider: '#E5E7EB',
  },
  shape: {
    borderRadius: 16, // More rounded corners
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(99, 102, 241, 0.08)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)',
    '0px 2px 8px rgba(100, 116, 139, 0.06)'
  ],
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontWeight: 700, letterSpacing: '-1px' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: '1.05rem' },
    body2: { fontSize: '0.97rem' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(99, 102, 241, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: 'rgba(244, 114, 182, 0.18)',
            color: '#f472b6',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0px 2px 8px rgba(100, 116, 139, 0.06)',
          padding: '32px 24px',
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header onMenuClick={toggleSidebar} />
          <div className="app-body">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="app-main">
              <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sentiment" element={<SentimentAnalysis />} />
                  <Route path="/data-sources" element={<DataSources />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/real-time" element={<RealTimeMonitor />} />
                </Routes>
              </Container>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
