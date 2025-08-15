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

// Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
