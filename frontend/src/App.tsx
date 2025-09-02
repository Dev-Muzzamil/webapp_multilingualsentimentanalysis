import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SentimentAnalysis from './components/SentimentAnalysis/SentimentAnalysis';
import DataSources from './components/DataSources/DataSources';
import Analytics from './components/Analytics/Analytics';
import RealTimeMonitor from './components/RealTime/RealTimeMonitor';
import Contact from './components/Static/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16 w-full min-w-0">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sentiment" element={<SentimentAnalysis />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/real-time" element={<RealTimeMonitor />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
