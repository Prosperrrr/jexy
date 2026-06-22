import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser, SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import posthog from 'posthog-js';
import { SpeedInsights } from '@vercel/speed-insights/react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TrackSeparationPage from './pages/TrackSeparationPage';
import AudioEnhancerPage from './pages/AudioEnhancerPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ModelsPage from './pages/ModelsPage';
import WorkflowPage from './pages/WorkflowPage';
import ChangelogPage from './pages/ChangelogPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';

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
      <ScrollToTop />
      <SpeedInsights />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          
          {/* SSO Callback */}
          <Route path="/sso-callback" element={
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined animate-spin-slow text-4xl text-slate-400 dark:text-slate-500">loop</span>
                <p className="text-slate-500 dark:text-slate-400 font-light tracking-wide text-sm">Completing sign in...</p>
              </div>
              <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard" />
            </div>
          } />
        
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
        
        <Route path="/track-separation" element={<TrackSeparationPage />} />
        
        <Route path="/audio-enhancer" element={<AudioEnhancerPage />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
