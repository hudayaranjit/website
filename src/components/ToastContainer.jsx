import React from 'react';
import { useStore } from '../store/store';

export const ToastContainer = () => {
  const { notifications } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '400px',
    }}>
      {notifications.map((note) => (
        <div key={note.id} style={{
          background: note.type === 'error' ? 'var(--color-critical)' : 'var(--color-surface)',
          color: note.type === 'error' ? 'white' : 'var(--color-text-main)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: note.type === 'error' ? 'none' : `4px solid ${note.type === 'success' ? 'var(--color-low)' : 'var(--color-primary)'}`,
          animation: 'slideInRight 0.3s ease forwards',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{note.message}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {new Date(note.time).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};
