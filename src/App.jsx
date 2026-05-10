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

function App() {
  const { refreshQueue, fetchInitialData } = useStore();

  useEffect(() => {
    // Fetch initial data once
    fetchInitialData();
    
    // Start background simulation loop
    const interval = setInterval(() => {
      refreshQueue();
    }, 15000); 
    return () => clearInterval(interval);
  }, [refreshQueue, fetchInitialData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/reception" element={<Layout><Reception /></Layout>} />
        <Route path="/doctor" element={<Layout><DoctorDashboard /></Layout>} />
        <Route path="/patient" element={<Layout><PatientView /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        
        {/* Placeholders for settings for now */}
        <Route path="/settings" element={<Layout><div className="p-8"><h2>Settings (Pending)</h2></div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


