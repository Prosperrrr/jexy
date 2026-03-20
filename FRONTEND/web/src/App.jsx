import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold mb-4">Dashboard</h1>
              <p className="text-slate-500">Authentication successful!</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
