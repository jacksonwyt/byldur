import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import EditorLayout from './components/layouts/EditorLayout';

// Regular components
import Spinner from './components/common/Spinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';
import AnalyticsDebugger from './components/analytics/AnalyticsDebugger';
import AnalyticsTest from './pages/AnalyticsTest';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewProject = lazy(() => import('./pages/NewProject'));
const Editor = lazy(() => import('./pages/Editor'));
const Subscription = lazy(() => import('./pages/Subscription'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Features = lazy(() => import('./pages/Features'));
const Templates = lazy(() => import('./pages/Templates'));
const Demo = lazy(() => import('./pages/Demo'));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Spinner fullScreen message="Loading application..." />;
  }

  return (
    <>
      <Suspense fallback={<Spinner fullScreen message="Loading page..." />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            
            {/* Public feature pages - allowing users to explore without login */}
            <Route path="features" element={<Features />} />
            <Route path="templates" element={<Templates />} />
            <Route path="demo" element={<Demo />} />
            
            {/* Test routes only available in development */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="analytics-test" element={<AnalyticsTest />} />
            )}
          </Route>

          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
          </Route>
          
          {/* Project creation route */}
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<NewProject />} />
          </Route>

          {/* Editor routes with authentication but no subscription requirement */}
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute>
                <EditorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Editor />} />
            <Route path=":projectId" element={<Editor />} />
          </Route>

          {/* Fallback routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
      
      {/* Debug tools - only in development */}
      {process.env.NODE_ENV === 'development' && <AnalyticsDebugger />}
    </>
  );
}

export default App; 