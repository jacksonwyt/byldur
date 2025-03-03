import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { AIProvider } from './contexts/AIContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { EditorProvider } from './hooks/useEditor';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AIProvider>
          <CollaborationProvider>
            <AnalyticsProvider>
              <EditorProvider>
                <App />
              </EditorProvider>
            </AnalyticsProvider>
          </CollaborationProvider>
        </AIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();