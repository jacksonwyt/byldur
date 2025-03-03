import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthApi from './hooks/useAuthApi';
import { Suspense, lazy } from 'react';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import EditorLayout from './components/layouts/EditorLayout';

// Regular components - frequently used across the app
import { Spinner } from './components/ui';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';


// Group 1: Public pages - marketing and authentication
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const Features = lazy(() => import(/* webpackChunkName: "features" */ './pages/Features'));
const Demo = lazy(() => import(/* webpackChunkName: "demo" */ './pages/Demo'));

// Group 2: Authentication pages - bundled together
const AuthPages = {
  Login: lazy(() => import(/* webpackChunkName: "auth" */ './pages/Login')),
  Register: lazy(() => import(/* webpackChunkName: "auth" */ './pages/Register')),
  ForgotPassword: lazy(() => import(/* webpackChunkName: "auth" */ './pages/ForgotPassword')),
  ResetPassword: lazy(() => import(/* webpackChunkName: "auth" */ './pages/ResetPassword')),
};

// Group 3: Dashboard and project management pages - bundled together
const DashboardPages = {
  Dashboard: lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')),
  ProjectDetails: lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/ProjectDetails')),
  NewProject: lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/NewProject')),
  Profile: lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Profile')),
  Subscription: lazy(() => import(/* webpackChunkName: "subscription" */ './pages/Subscription')),
  Templates: lazy(() => import(/* webpackChunkName: "templates" */ './pages/Templates')),
};

// Group 4: Editor pages - bundled separately since they're the heaviest
const Editor = lazy(() => import(/* webpackChunkName: "editor" */ './pages/Editor'));

function App() {
  const { loading } = useAuthApi();

  if (loading) {
    return <Spinner fullScreen message="Loading application..." />;
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          {/* Marketing pages */}
          <Route index element={
            <Suspense fallback={<Spinner fullScreen message="Loading home page..." />}>
              <Home />
            </Suspense>
          } />
          <Route path="features" element={
            <Suspense fallback={<Spinner fullScreen message="Loading features..." />}>
              <Features />
            </Suspense>
          } />
          <Route path="demo" element={
            <Suspense fallback={<Spinner fullScreen message="Loading demo..." />}>
              <Demo />
            </Suspense>
          } />
          
          {/* Authentication pages - grouped together */}
          <Route path="login" element={
            <Suspense fallback={<Spinner fullScreen message="Loading authentication..." />}>
              <AuthPages.Login />
            </Suspense>
          } />
          <Route path="register" element={
            <Suspense fallback={<Spinner fullScreen message="Loading authentication..." />}>
              <AuthPages.Register />
            </Suspense>
          } />
          <Route path="forgot-password" element={
            <Suspense fallback={<Spinner fullScreen message="Loading authentication..." />}>
              <AuthPages.ForgotPassword />
            </Suspense>
          } />
          <Route path="reset-password" element={
            <Suspense fallback={<Spinner fullScreen message="Loading authentication..." />}>
              <AuthPages.ResetPassword />
            </Suspense>
          } />
          
          {/* Templates are accessible to non-authenticated users too */}
          <Route path="templates" element={
            <Suspense fallback={<Spinner fullScreen message="Loading templates..." />}>
              <DashboardPages.Templates />
            </Suspense>
          } />
          
        </Route>

        {/* Protected dashboard routes - grouped with dedicated suspense boundaries */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <Suspense fallback={<Spinner fullScreen message="Loading dashboard..." />}>
              <DashboardPages.Dashboard />
            </Suspense>
          } />
          <Route path="subscription" element={
            <Suspense fallback={<Spinner fullScreen message="Loading subscription details..." />}>
              <DashboardPages.Subscription />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<Spinner fullScreen message="Loading profile..." />}>
              <DashboardPages.Profile />
            </Suspense>
          } />
          <Route path="projects/:projectId" element={
            <Suspense fallback={<Spinner fullScreen message="Loading project details..." />}>
              <DashboardPages.ProjectDetails />
            </Suspense>
          } />
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
          <Route index element={
            <Suspense fallback={<Spinner fullScreen message="Loading project creator..." />}>
              <DashboardPages.NewProject />
            </Suspense>
          } />
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
          <Route index element={
            <Suspense fallback={<Spinner fullScreen message="Loading editor..." />}>
              <Editor />
            </Suspense>
          } />
          <Route path=":projectId" element={
            <Suspense fallback={<Spinner fullScreen message="Loading editor..." />}>
              <Editor />
            </Suspense>
          } />
        </Route>

        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App; 