import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import SentimentAnalysis from './components/SentimentAnalysis/SentimentAnalysis';
import DataSources from './components/DataSources/DataSources';
import Analytics from './components/Analytics/Analytics';
import RealTimeMonitor from './components/RealTime/RealTimeMonitor';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-cyber-50 via-cyber-200 to-cyber-300 cyber-grid">
        <Header onMenuClick={toggleSidebar} />
        <div className="flex pt-16">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}>
            <div className="p-6 max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sentiment" element={<SentimentAnalysis />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/real-time" element={<RealTimeMonitor />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
