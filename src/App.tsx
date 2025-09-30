import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SEOWrapper } from './components/SEOWrapper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AuditReport from './pages/AuditReport';
import FileManagement from './pages/FileManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import NotificationToast from './components/NotificationToast';
import PageViewTracker from './components/Analytics';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <SEOWrapper>
              <div className="min-h-screen bg-gray-900 text-white">
                <Header />
                <NotificationToast />
                <PageViewTracker page={window.location.hash || '/'} />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/audit/:auditId" element={<AuditReport />} />
                  <Route path="/files" element={
                    <ProtectedRoute>
                      <FileManagement />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </SEOWrapper>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;