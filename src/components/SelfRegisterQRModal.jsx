import React from 'react';
import { X, Smartphone } from 'lucide-react';
import '../styles/components.css';

export const SelfRegisterQRModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Assuming the app is hosted on the same origin
  const registerUrl = `${window.location.origin}/self-register`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(registerUrl)}`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Smartphone size={28} />
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Self Registration</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Patients can scan this QR code with their mobile device to register themselves and get a token number instantly.
        </p>
        
        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: '1.5rem' }}>
          <img src={qrUrl} alt="QR Code" width={200} height={200} style={{ display: 'block' }} />
        </div>
        
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--border-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)', wordBreak: 'break-all' }}>
          {registerUrl}
        </div>
      </div>
    </div>
  );
};
