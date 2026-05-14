import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut, Shield, Stethoscope, UserPlus, Users } from 'lucide-react';

const ROLE_CONFIG = {
  admin: { label: 'Administrator', icon: <Shield size={14} color="white" />, color: '#3B82F6' },
  reception: { label: 'Reception Desk', icon: <UserPlus size={14} color="white" />, color: '#22C55E' },
  doctor: { label: 'Doctor', icon: <Stethoscope size={14} color="white" />, color: '#A855F7' },
  patient: { label: 'Patient', icon: <Users size={14} color="white" />, color: '#F97316' },
};

export const TopHeader = () => {
  const { notifications, currentUserRole, currentUserId, doctors, logout } = useStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const unreadCount = notifications.length;
  const roleConfig = ROLE_CONFIG[currentUserRole] || ROLE_CONFIG.admin;
  
  // If doctor, show their name
  const displayName = currentUserRole === 'doctor' && currentUserId
    ? (doctors.find(d => d.id === currentUserId)?.name || 'Doctor')
    : roleConfig.label;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <header className="top-header">
      {/* Left */}
      <div>
        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
          🏥 City General Hospital
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Main Branch — Outpatient Department
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Clock */}
        <div className="header-time">
          📅 {formatDate(time)} &nbsp;|&nbsp; 🕐 {formatTime(time)}
        </div>

        {/* Notification Bell */}
        <button
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              width: '16px', height: '16px',
              background: 'var(--critical)', color: 'white',
              borderRadius: '50%', fontSize: '0.625rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User pill with dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.4rem 0.75rem 0.4rem 0.4rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: roleConfig.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {roleConfig.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>{displayName}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{roleConfig.label}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowDropdown(false)} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
                width: '200px', padding: '0.5rem',
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                animation: 'fadeSlideUp 0.2s ease',
              }}>
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Signed in as
                </div>
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  {displayName}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    width: '100%', padding: '0.625rem 0.75rem',
                    background: 'transparent', border: 'none',
                    color: 'var(--critical)', cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem', fontWeight: '600',
                    fontFamily: 'var(--font-family)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--critical-bg)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
