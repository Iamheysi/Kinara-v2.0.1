import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

// Called by supabase-auth.js once authentication is resolved
window.__mountApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
}

// If auth resolved before Vite bundle loaded (unlikely but safe)
if (window.__kinaraReady) window.__mountApp()
