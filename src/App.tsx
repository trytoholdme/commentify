import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import { useAuth } from './hooks/useAuth';
import { useStore } from './store';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#111827] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const loadComments = useStore(state => state.loadComments);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load comments when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadComments();
    }
  }, [isAuthenticated, loadComments]);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-[#111827] text-[#F3F4F6]">
      <Toaster position="top-right" />
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;