import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Search, Clock, Activity, ChevronRight, AlertCircle } from 'lucide-react';

const PatientView = () => {
  const { patients } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const myStatus = patients.find(p => p.tokenNumber.toLowerCase() === searchQuery.toLowerCase().trim());
  const calledPatients = patients.filter(p => p.status === 'in-consultation');
  const waitingCount = patients.filter(p => p.status === 'waiting').length;

  const priorityGradient = {
    Critical: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
    High: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))',
    Medium: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(234,179,8,0.05))',
    Low: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem' }}>
          <Activity size={14} /> LIVE QUEUE STATUS
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-1px' }}>
          Check Your <span style={{ background: 'linear-gradient(135deg, var(--primary), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wait Time</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Enter your token number below to get a real-time status update
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--high)' }}>{waitingCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Queue</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--status-consult)' }}>{calledPatients.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Consultation</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{patients.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Today</div>
          </div>
        </div>
      </div>

      {/* Token Search */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.04))', border: '1px solid var(--border-default)' }}>
        <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Enter Token (e.g. C-001)"
            style={{ paddingLeft: '2.75rem', fontSize: '1.05rem', textAlign: 'center', textTransform: 'uppercase', borderRadius: '999px', letterSpacing: '0.05em' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery && !myStatus && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> Token not found. Please verify your slip.
          </div>
        )}

        {myStatus && (
          <div style={{ marginTop: '1.5rem', background: myStatus.priorityLevel ? (priorityGradient[myStatus.priorityLevel] || 'var(--bg-card)') : 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-default)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Your Token</div>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1 }}>{myStatus.tokenNumber}</div>
              <div style={{ marginTop: '0.5rem' }}><span className={`badge badge-${myStatus.priorityLevel?.toLowerCase()}`}>{myStatus.priorityLevel} Priority</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem', textAlign: 'center' }}>
              {[
                { label: 'Status', value: myStatus.status === 'in-consultation' ? '🟢 Called' : myStatus.status === 'waiting' ? '🟠 Waiting' : '✓ Done', big: true },
                { label: 'Est. Wait', value: myStatus.status === 'in-consultation' ? 'NOW' : `${myStatus.estimatedWaitTime || 0}m`, big: true },
                { label: 'Department', value: myStatus.department, big: false },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontWeight: '700', fontSize: s.big ? '1rem' : '0.875rem', color: 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>
            {myStatus.priorityLevel === 'Critical' && (
              <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', borderRadius: 'var(--radius-md)', color: 'var(--critical)', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>
                ⚡ Your case is marked CRITICAL. A doctor will attend to you immediately.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Now Serving */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-consult)', boxShadow: '0 0 8px var(--status-consult)', animation: 'pulse-ring 1.5s ease-out infinite' }} />
          <h3>Now Serving — Proceed to Room</h3>
        </div>
        {calledPatients.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Clock size={40} color="var(--border-default)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No patients currently in consultation. Please wait.</p>
          </div>
        ) : (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {calledPatients.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.125rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                animation: `fadeSlideUp 0.4s ${i * 0.08}s cubic-bezier(0.16,1,0.3,1) both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-consult)' }}>{p.tokenNumber}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.department}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--status-consult)', fontWeight: '700', fontSize: '0.8rem' }}>IN CONSULTATION</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room {(i + 1) * 3}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientView;
