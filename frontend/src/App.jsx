import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Layout/Header.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import DataCollection from './components/DataCollection/DataCollection.jsx';
import Analytics from './components/Analytics/Analytics.jsx';
import Upload from './components/Upload/Upload.jsx';
import Account from './components/Account/Account.jsx';
import Login from './components/Auth/Login.jsx';
import SignUp from './components/Auth/SignUp.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Main App Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="pt-16 w-full min-w-0">
                <div className="w-full">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/collect" element={<DataCollection />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/account" element={<Account />} />
                  </Routes>
                </div>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;