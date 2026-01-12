
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Robustness check: 
 * If the environment's native DOMException is missing or misconfigured 
 * (which often triggers the node-domexception warning), we provide 
 * a minimal fallback to ensure React 19 and Gemini SDK stability.
 */
if (typeof window !== 'undefined' && !window.DOMException) {
    (window as any).DOMException = class extends Error {
        constructor(message?: string, name?: string) {
            super(message);
            this.name = name || 'DOMException';
        }
    };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
