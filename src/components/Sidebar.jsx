import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, UserPlus, Stethoscope, Users, BarChart2, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview',     path: '/admin',     icon: <LayoutDashboard size={18} /> },
    { label: 'Reception',    path: '/reception', icon: <UserPlus size={18} /> },
    { label: 'Doctor Suite', path: '/doctor',    icon: <Stethoscope size={18} /> },
    { label: 'Patient View', path: '/patient',   icon: <Users size={18} /> },
    { label: 'Analytics',    path: '/analytics', icon: <BarChart2 size={18} /> },
    { label: 'Settings',     path: '/settings',  icon: <Settings size={18} /> },
  ];

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
        Live System — Demo Mode
      </div>
    </aside>
  );
};
