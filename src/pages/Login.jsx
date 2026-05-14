import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Activity, Shield, Stethoscope, UserPlus, Users, ArrowRight, Brain } from 'lucide-react';

const ROLES = [
  {
    id: 'admin',
    label: 'Administrator',
    desc: 'Full system access — manage queues, doctors, and analytics',
    icon: <Shield size={28} />,
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    id: 'reception',
    label: 'Reception Desk',
    desc: 'Register patients and manage walk-in queue',
    icon: <UserPlus size={28} />,
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'doctor',
    label: 'Doctor',
    desc: 'View your patient queue and manage consultations',
    icon: <Stethoscope size={28} />,
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
    border: 'rgba(168,85,247,0.3)',
  },
  {
    id: 'patient',
    label: 'Patient Portal',
    desc: 'Check your token status and estimated wait time',
    icon: <Users size={28} />,
    color: '#F97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))',
    border: 'rgba(249,115,22,0.3)',
  },
];

const Login = () => {
  const { login, doctors } = useStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      login(selectedRole, selectedRole === 'doctor' ? selectedDoctorId : null);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background Orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          top: '-200px', right: '-100px',
          animation: 'float 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          bottom: '-150px', left: '-100px',
          animation: 'float 25s ease-in-out infinite reverse',
        }} />
      </div>

      <div style={{ maxWidth: '580px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
          }}>
            <Activity size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            Medi<span style={{ background: 'linear-gradient(135deg, #3B82F6, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Queue</span> AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Intelligent Hospital Queue Management System
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(59,130,246,0.1)', color: 'var(--primary)',
            padding: '0.3rem 0.875rem', borderRadius: '999px',
            fontSize: '0.7rem', fontWeight: '700', marginTop: '0.75rem',
            border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <Brain size={12} /> AI Engine v2.0 Active
          </div>
        </div>

        {/* Role Cards */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Select Your Role</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose how you'd like to access the system</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {ROLES.map(role => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${selectedRole === role.id ? role.border : 'var(--border-default)'}`,
                  background: selectedRole === role.id ? role.gradient : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: selectedRole === role.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selectedRole === role.id ? `0 4px 20px ${role.border}` : 'none',
                }}
              >
                <div style={{
                  color: selectedRole === role.id ? role.color : 'var(--text-muted)',
                  marginBottom: '0.75rem',
                  transition: 'color 0.2s',
                }}>
                  {role.icon}
                </div>
                <div style={{
                  fontWeight: '700', fontSize: '0.9rem',
                  color: selectedRole === role.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  marginBottom: '0.25rem',
                }}>
                  {role.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {role.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Doctor Selector (only if doctor role) */}
          {selectedRole === 'doctor' && (
            <div className="form-group" style={{ marginBottom: '1.5rem', animation: 'fadeSlideUp 0.3s ease' }}>
              <label className="form-label">Select Your Profile</label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={e => setSelectedDoctorId(e.target.value)}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.department}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={!selectedRole || isLoggingIn}
            style={{
              width: '100%', padding: '0.875rem', fontSize: '0.95rem',
              opacity: selectedRole ? 1 : 0.5,
              boxShadow: selectedRole ? '0 4px 24px rgba(59,130,246,0.35)' : 'none',
            }}
          >
            {isLoggingIn ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing In...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                Access Dashboard <ArrowRight size={16} />
              </span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Demo mode — no authentication required. Select any role to explore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Spinning animation helper — inline
const RefreshCw = ({ size, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} {...props}>
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

export default Login;
