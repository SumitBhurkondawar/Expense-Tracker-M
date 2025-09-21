import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import './index.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" /> : <AuthPage />} 
      />
      <Route 
        path="/dashboard/*" 
        element={user ? <Dashboard /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/auth"} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="app">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                },
                success: {
                  style: {
                    background: '#064e3b',
                    color: '#d1fae5',
                    border: '1px solid #047857',
                  },
                },
                error: {
                  style: {
                    background: '#7f1d1d',
                    color: '#fee2e2',
                    border: '1px solid #dc2626',
                  },
                },
              }}
            />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;