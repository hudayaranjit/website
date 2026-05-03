import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { Bell, User, ChevronDown } from 'lucide-react';

export const TopHeader = () => {
  const { notifications } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const unreadCount = notifications.length;

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

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.4rem 0.75rem 0.4rem 0.4rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-default)',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '28px', height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={14} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>System Admin</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrator</div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
};
