import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './providers/ThemeProvider';
import { AnimationProvider } from './providers/AnimationProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AnimationProvider>
          <App />
        </AnimationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);