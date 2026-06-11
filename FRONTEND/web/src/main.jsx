import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'

// Import Clerk key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key")
}

// Initialize PostHog
posthog.init(
  import.meta.env.VITE_POSTHOG_KEY,
  {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#0f172a',
          fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
          borderRadius: '1rem',
        },
        elements: {
          userButtonPopoverCard: 'shadow-2xl border border-slate-100 dark:border-zinc-800 rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl',
          userButtonPopoverActionButton: 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all',
          userButtonPopoverActionButtonText: 'font-medium text-slate-700 dark:text-slate-300',
          userButtonPopoverActionButtonIcon: 'text-slate-500 dark:text-slate-400',
          userPreviewMainIdentifier: 'font-bold text-slate-900 dark:text-white',
          userPreviewSecondaryIdentifier: 'text-slate-500 dark:text-slate-400',
          userButtonPopoverFooter: 'hidden',
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
