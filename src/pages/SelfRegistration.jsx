import React, { useState } from 'react';
import { useStore } from '../store/store';
import { UserPlus, Zap, CheckCircle, Clock, HeartPulse, Shield } from 'lucide-react';
import '../styles/components.css';
import '../styles/stitch-theme.css';

const SelfRegistration = () => {
  const { addPatient, departments, patients } = useStore();
  const [lastToken, setLastToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '',
    symptoms: '', department: departments[0] || 'General Medicine',
    visitType: 'new', isEmergency: false, arrivalTime: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tempId = `pat-${Date.now()}`;
      await addPatient({
        ...formData,
        id: tempId,
        age: parseInt(formData.age),
        arrivalTime: new Date().toISOString(),
        appointmentType: 'walk-in',
        source: 'self-service'
      });
      
      setLastToken({
        name: formData.name,
        dept: formData.department,
      });
      setFormData({ name: '', age: '', gender: 'Male', phone: '', symptoms: '', department: departments[0] || 'General Medicine', visitType: 'new', isEmergency: false, arrivalTime: '' });
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submittedPatient = lastToken ? patients.find(p => p.name === lastToken.name && p.department === lastToken.dept) : null;

  if (submittedPatient) {
    const queuePosition = patients
      .filter(p => p.assignedDoctorId === submittedPatient.assignedDoctorId && p.status === 'waiting')
      .findIndex(p => p.id === submittedPatient.id) + 1;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', padding: '1rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', textAlign: 'center', borderTop: `4px solid ${submittedPatient.priorityLevel === 'Critical' ? 'var(--critical)' : 'var(--primary)'}` }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--low-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
            <CheckCircle size={40} color="var(--low)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Registration Complete</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You have been added to the queue.</p>
          
          <div style={{ background: 'var(--border-subtle)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>YOUR TOKEN NUMBER</div>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', lineHeight: 1 }}>{submittedPatient.tokenNumber}</div>
            <div style={{ marginTop: '1rem' }}>
               <span className={`badge badge-${submittedPatient.priorityLevel?.toLowerCase()}`}>{submittedPatient.priorityLevel} Priority</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Wait</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{submittedPatient.estimatedWaitTime || 0}m</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Queue Position</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>#{queuePosition || '—'}</div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Please take a seat. Your token number will be called shortly.</p>
          
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setLastToken(null)}>
            Register Another Person
          </button>
        </div>
      </div>
    );
  }

  const setField = (key, value) => setFormData(f => ({ ...f, [key]: value }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <HeartPulse size={36} color="var(--primary)" />
            <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', margin: 0 }}>MediQueue</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Self-Service Patient Registration</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0', color: 'var(--text-primary)' }}>Your Details</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI will analyze your symptoms to prioritize your care</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input required type="text" className="form-input" value={formData.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. John Doe" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input required type="number" className="form-input" value={formData.age} onChange={e => setField('age', e.target.value)} placeholder="e.g. 34" min="0" max="120" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-select" value={formData.gender} onChange={e => setField('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input required type="tel" className="form-input" value={formData.phone} onChange={e => setField('phone', e.target.value)} placeholder="e.g. 555-0199" />
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms / Describe How You Feel *</label>
              <textarea
                required className="form-input" rows="4"
                value={formData.symptoms}
                onChange={e => setField('symptoms', e.target.value)}
                placeholder="Describe your symptoms in detail so our AI can best assist you... (e.g. severe chest pain, shortness of breath, fever for 3 days)"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Department *</label>
              <select className="form-select" value={formData.department} onChange={e => setField('department', e.target.value)}>
                {(departments.length > 0 ? departments : ['General Medicine','Cardiology','Orthopedics','Pediatrics','Emergency']).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1.5rem', padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Shield size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Your information is securely processed by our AI Triage Engine to estimate your wait time and assign you to the most appropriate queue.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem', fontWeight: '600' }}
            >
              {isSubmitting ? 'Processing...' : 'Get Token Number'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelfRegistration;
