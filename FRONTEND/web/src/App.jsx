import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser, SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import posthog from 'posthog-js';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TrackSeparationPage from './pages/TrackSeparationPage';
import AudioEnhancerPage from './pages/AudioEnhancerPage';
import HowItWorksPage from './pages/HowItWorksPage';

function App() {
  const { user } = useUser();

  useEffect(() => {
    if (user && posthog) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName
      });
    } else if (posthog) {
      posthog.reset();
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          
          {/* SSO Callback */}
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard" />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <>
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
            <SignedOut>
              <AuthPage mode="signin" />
            </SignedOut>
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
            <SignedOut>
              <AuthPage mode="signup" />
            </SignedOut>
          </>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <DashboardPage />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        } />
        
        <Route path="/track-separation" element={
          <>
            <SignedIn>
              <TrackSeparationPage />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        } />
        
        <Route path="/audio-enhancer" element={
          <>
            <SignedIn>
              <AudioEnhancerPage />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        } />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
