import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/store';
import './styles/components.css';
import './styles/stitch-theme.css';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ToastContainer } from './components/ToastContainer';

// Page Imports
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Reception from './pages/Reception';
import PatientView from './pages/PatientView';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <TopHeader />
      <main className="page-container">{children}</main>
    </div>
    <ToastContainer />
  </div>
);

// Route guard — redirects to login if not authenticated
const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, currentUserRole } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    // Redirect to their default page based on role
    const roleDefaults = {
      admin: '/admin',
      reception: '/reception',
      doctor: '/doctor',
      patient: '/patient',
    };
    return <Navigate to={roleDefaults[currentUserRole] || '/admin'} replace />;
  }
  
  return children;
};

function App() {
  const { refreshQueue, fetchInitialData, isAuthenticated, currentUserRole } = useStore();

  useEffect(() => {
    // Fetch initial data once (even before login so doctors list is ready)
    fetchInitialData();
    
    // Start background simulation loop
    const interval = setInterval(() => {
      refreshQueue();
    }, 15000); 
    return () => clearInterval(interval);
  }, [refreshQueue, fetchInitialData]);

  // Default redirect based on role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    const routes = {
      admin: '/admin',
      reception: '/reception',
      doctor: '/doctor',
      patient: '/patient',
    };
    return routes[currentUserRole] || '/admin';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public: Login */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/reception" element={
          <ProtectedRoute allowedRoles={['admin', 'reception']}>
            <Layout><Reception /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['admin', 'doctor']}>
            <Layout><DoctorDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['admin', 'patient']}>
            <Layout><PatientView /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><Analytics /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
