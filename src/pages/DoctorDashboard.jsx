import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Stethoscope, CheckCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const { patients, doctors, callNextPatient, updatePatientStatus } = useStore();
  
  // For demo: Use state to allow switching doctors
  const [currentDoctorId, setCurrentDoctorId] = useState('doc-1');
  const doctor = doctors.find(d => d.id === currentDoctorId);
  
  // Filter queue for just this doctor
  const myQueue = patients.filter(p => p.assignedDoctorId === currentDoctorId);
  
  const currentPatient = myQueue.find(p => p.status === 'in-consultation');
  const waitingPatients = myQueue.filter(p => p.status === 'waiting');
  const nextPatient = waitingPatients.length > 0 ? waitingPatients[0] : null;

  const handleCallNext = () => {
    callNextPatient(currentDoctorId);
  };

  const handleCompleteCurrent = () => {
    if (currentPatient) {
      updatePatientStatus(currentPatient.id, 'completed');
    }
  };

  if (!doctor) return <div>Doctor profile not found (Demo error)</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Doctor's Suite</h1>
          <p className="text-muted">Welcome, {doctor.name} ({doctor.department})</p>
        </div>
        <div style={{ background: 'var(--color-surface)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Switch Doctor (Demo):</label>
          <select 
            className="form-select" 
            value={currentDoctorId} 
            onChange={(e) => setCurrentDoctorId(e.target.value)}
            style={{ padding: '0.25rem 0.5rem', width: 'auto', display: 'inline-block' }}
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Left Column: Active Patient & Next Up */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {currentPatient ? (
            <div className="card" style={{ borderTop: '4px solid var(--color-status-consult)' }}>
              <div className="flex items-center justify-between mb-4">
                 <h2 style={{ color: 'var(--color-status-consult)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <Stethoscope size={24} /> Currently Consulting
                 </h2>
                 <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Token: {currentPatient.tokenNumber}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>Patient Name</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{currentPatient.name}</div>
                  <div className="text-muted">{currentPatient.age} yrs • {currentPatient.gender}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>AI Triage Priority</div>
                  <div>
                    <span className={`badge badge-${currentPatient.priorityLevel.toLowerCase()}`}>
                      {currentPatient.priorityLevel} Priority
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Reported Symptoms</div>
                <div style={{ fontWeight: '500' }}>{currentPatient.symptoms}</div>
              </div>

              <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={() => updatePatientStatus(currentPatient.id, 'missed')}>
                  Mark No-Show
                </button>
                <div className="flex gap-2">
                   <button className="btn btn-primary" onClick={handleCompleteCurrent}>
                     <CheckCircle size={18} /> Complete Consultation
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
               <Clock size={48} style={{ margin: '0 auto 1rem', opacity: '0.5' }} />
               <h3>No active consultation</h3>
               <p>Press "Call Next Patient" when ready.</p>
            </div>
          )}

          {/* Next Up Sneak Peek */}
          {nextPatient && (
            <div className="card" style={{ background: 'var(--color-surface-hover)' }}>
              <h3 className="mb-4">Next in Queue</h3>
              <div className="flex items-center justify-between">
                 <div>
                    <div style={{ fontWeight: '600' }}>{nextPatient.tokenNumber} - {nextPatient.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>{nextPatient.symptoms}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${nextPatient.priorityLevel.toLowerCase()}`}>{nextPatient.priorityLevel}</span>
                 </div>
              </div>
              {!currentPatient && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCallNext}>
                  Call Patient In
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Queue Sidebar */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="flex items-center justify-between mb-4">
             <h3>My Waitlist</h3>
             <span className="badge badge-medium">{waitingPatients.length} Waiting</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
            {waitingPatients.length === 0 && <div className="text-muted text-center py-4">Queue is empty</div>}
            
            {waitingPatients.map((p, index) => (
              <div key={p.id} style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: index === 0 ? 'var(--color-primary-light)' : 'transparent' }}>
                 <div className="flex justify-between items-center mb-1">
                    <strong style={{ color: index === 0 ? 'var(--color-primary-dark)' : 'inherit' }}>{p.tokenNumber}</strong>
                    <span style={{ fontSize: '0.75rem' }} className={`badge badge-${p.priorityLevel.toLowerCase()}`}>{p.priorityLevel}</span>
                 </div>
                 <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{p.name}</div>
                 <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{p.symptoms}</span>
                    <span style={{ fontWeight: '600' }}>Est: {p.estimatedWaitTime}m</span>
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
