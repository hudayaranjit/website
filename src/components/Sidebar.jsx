import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import { Activity, LayoutDashboard, UserPlus, Stethoscope, Users, BarChart2, Settings } from 'lucide-react';

// Define which nav items each role can see
const ROLE_NAV = {
  admin: ['admin', 'reception', 'doctor', 'patient', 'analytics', 'settings'],
  reception: ['reception', 'patient'],
  doctor: ['doctor', 'patient'],
  patient: ['patient'],
};

const ALL_NAV_ITEMS = [
  { id: 'admin',     label: 'Overview',     path: '/admin',     icon: <LayoutDashboard size={18} /> },
  { id: 'reception', label: 'Reception',    path: '/reception', icon: <UserPlus size={18} /> },
  { id: 'doctor',    label: 'Doctor Suite', path: '/doctor',    icon: <Stethoscope size={18} /> },
  { id: 'patient',   label: 'Patient View', path: '/patient',   icon: <Users size={18} /> },
  { id: 'analytics', label: 'Analytics',    path: '/analytics', icon: <BarChart2 size={18} /> },
  { id: 'settings',  label: 'Settings',     path: '/settings',  icon: <Settings size={18} /> },
];

export const Sidebar = () => {
  const location = useLocation();
  const { currentUserRole } = useStore();

  // Filter nav items based on role
  const allowedIds = ROLE_NAV[currentUserRole] || ROLE_NAV.admin;
  const navItems = ALL_NAV_ITEMS.filter(item => allowedIds.includes(item.id));

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={20} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <strong>MediQueue</strong>
          <span>AI SYSTEM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="live-dot" />
        Live System — {currentUserRole ? currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1) : 'Demo'} Mode
      </div>
    </aside>
  );
};
