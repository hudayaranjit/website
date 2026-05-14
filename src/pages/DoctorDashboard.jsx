import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Stethoscope, CheckCircle, Clock, UserX, ChevronRight, Activity, Brain } from 'lucide-react';

const DoctorDashboard = () => {
  const { patients, doctors, callNextPatient, updatePatientStatus, currentUserRole, currentUserId } = useStore();
  
  // If logged in as a doctor, use their ID; otherwise allow switching (admin mode)
  const [currentDoctorId, setCurrentDoctorId] = useState(currentUserId || 'doc-1');
  const doctor = doctors.find(d => d.id === currentDoctorId);
  
  // Filter queue for just this doctor
  const myQueue = patients.filter(p => p.assignedDoctorId === currentDoctorId);
  
  const currentPatient = myQueue.find(p => p.status === 'in-consultation');
  const waitingPatients = myQueue.filter(p => p.status === 'waiting');
  const completedPatients = myQueue.filter(p => p.status === 'completed');
  const nextPatient = waitingPatients.length > 0 ? waitingPatients[0] : null;

  const handleCallNext = () => {
    callNextPatient(currentDoctorId);
  };

  const handleCompleteCurrent = () => {
    if (currentPatient) {
      updatePatientStatus(currentPatient.id, 'completed');
    }
  };

  if (!doctor) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <Clock size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
      <h2>Doctor Profile Not Found</h2>
      <p style={{ color: 'var(--text-muted)' }}>Please select a valid doctor profile.</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '4px', height: '28px', background: '#A855F7', borderRadius: '4px' }} />
            <h1>Doctor's Suite</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem', fontSize: '0.9rem' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong> — {doctor.department}
          </p>
        </div>
        {/* Admin can switch doctors */}
        {currentUserRole === 'admin' && (
          <div style={{ background: 'var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Switch Doctor:</label>
            <select 
              className="form-select" 
              value={currentDoctorId} 
              onChange={(e) => setCurrentDoctorId(e.target.value)}
              style={{ padding: '0.25rem 0.5rem', width: 'auto', display: 'inline-block', fontSize: '0.85rem' }}
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="var(--high)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>In Queue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--high)' }}>{waitingPatients.length}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Consulting</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{currentPatient ? 1 : 0}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} color="var(--low)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--low)' }}>{completedPatients.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Left Column: Active Patient & Next Up */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {currentPatient ? (
            <div className="glass-card" style={{ borderTop: '4px solid var(--low)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                 <h2 style={{ color: 'var(--low)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <Stethoscope size={24} /> Currently Consulting
                 </h2>
                 <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)' }}>
                   {currentPatient.tokenNumber}
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Patient Name</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{currentPatient.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentPatient.age} yrs · {currentPatient.gender}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>AI Priority</div>
                  <span className={`badge badge-${currentPatient.priorityLevel?.toLowerCase()}`}>
                    {currentPatient.priorityLevel} Priority
                  </span>
                  {currentPatient.aiExplanation && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      <Brain size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                      {currentPatient.aiExplanation}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: 'var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Reported Symptoms</div>
                <div style={{ fontWeight: '500', fontSize: '0.9rem', lineHeight: 1.5 }}>{currentPatient.symptoms}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => updatePatientStatus(currentPatient.id, 'missed')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserX size={16} /> Mark No-Show
                </button>
                <button className="btn btn-primary" onClick={handleCompleteCurrent} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} /> Complete Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
               <Clock size={48} style={{ margin: '0 auto 1rem', opacity: '0.3', color: 'var(--text-muted)' }} />
               <h3 style={{ color: 'var(--text-muted)' }}>No Active Consultation</h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                 {nextPatient ? 'Press "Call Next Patient" when ready.' : 'Your queue is empty — no patients waiting.'}
               </p>
            </div>
          )}

          {/* Next Up Sneak Peek */}
          {nextPatient && (
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ChevronRight size={18} color="var(--primary)" />
                <h3>Next in Queue</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--primary)', marginRight: '0.5rem' }}>{nextPatient.tokenNumber}</span>
                      {nextPatient.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{nextPatient.symptoms}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${nextPatient.priorityLevel?.toLowerCase()}`}>{nextPatient.priorityLevel}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Est: {nextPatient.estimatedWaitTime || 0}m</div>
                 </div>
              </div>
              {!currentPatient && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCallNext}>
                  <Stethoscope size={16} /> Call Patient In
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Queue Sidebar */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <h3>My Waitlist</h3>
             <span className="badge badge-medium">{waitingPatients.length} Waiting</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
            {waitingPatients.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.85rem' }}>Queue is empty — great work!</p>
              </div>
            )}
            
            {waitingPatients.map((p, index) => (
              <div key={p.id} style={{
                padding: '0.875rem',
                border: `1px solid ${index === 0 ? 'rgba(59,130,246,0.3)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                background: index === 0 ? 'rgba(59,130,246,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{
                      color: index === 0 ? 'var(--primary)' : 'var(--text-primary)',
                      fontFamily: 'monospace', fontSize: '0.9rem'
                    }}>
                      {p.tokenNumber}
                    </strong>
                    <span className={`badge badge-${p.priorityLevel?.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{p.priorityLevel}</span>
                 </div>
                 <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{p.name}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{p.symptoms}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>~{p.estimatedWaitTime || 0}m</span>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
