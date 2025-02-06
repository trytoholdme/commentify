import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Remove initial loader when app is ready
const removeLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.remove();
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  removeLoader()
);

// Preload critical routes
const preloadRoutes = () => {
  const routes = [
    () => import('./pages/DashboardPage'),
    () => import('./pages/LoginPage'),
    () => import('./pages/HomePage')
  ];

  routes.forEach(route => {
    route().catch(console.error);
  });
};

// Preload routes after initial render
window.requestIdleCallback?.(preloadRoutes) ?? setTimeout(preloadRoutes, 1000);