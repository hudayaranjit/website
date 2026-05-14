import React, { useState } from 'react';
import { useStore } from '../store/store';
import { UserPlus, Zap, CheckCircle, AlertOctagon, Clock, ArrowLeft, Sparkles } from 'lucide-react';

const Reception = () => {
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
        arrivalTime: formData.arrivalTime
          ? new Date(formData.arrivalTime).toISOString()
          : new Date().toISOString(),
        appointmentType: 'walk-in'
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

  // Find the just-added patient in the store to show their real token/estimate
  const submittedPatient = lastToken ? patients.find(p => p.name === lastToken.name && p.department === lastToken.dept) : null;

  if (submittedPatient) {
    const queuePosition = patients
      .filter(p => p.assignedDoctorId === submittedPatient.assignedDoctorId && p.status === 'waiting')
      .findIndex(p => p.id === submittedPatient.id) + 1;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '3rem', textAlign: 'center', borderTop: `4px solid ${submittedPatient.priorityLevel === 'Critical' ? 'var(--critical)' : 'var(--primary)'}` }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--low-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
            <CheckCircle size={40} color="var(--low)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Registration Successful</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Patient has been added to the AI-prioritized queue.</p>
          
          <div style={{ background: 'var(--border-subtle)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PATIENT TOKEN</div>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', lineHeight: 1 }}>{submittedPatient.tokenNumber}</div>
            <div style={{ marginTop: '1rem' }}>
               <span className={`badge badge-${submittedPatient.priorityLevel?.toLowerCase()}`}>{submittedPatient.priorityLevel} Priority</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'left', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Wait</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{submittedPatient.estimatedWaitTime || 0}m</div>
            </div>
            <div style={{ textAlign: 'left', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Position</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>#{queuePosition || '—'}</div>
            </div>
          </div>

          {submittedPatient.aiExplanation && (
            <div style={{ textAlign: 'left', padding: '1rem', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} /> AI Assessment
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{submittedPatient.aiExplanation}</div>
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setLastToken(null)}>
            <ArrowLeft size={16} /> Register Another Patient
          </button>
        </div>
      </div>
    );
  }

  const setField = (key, value) => setFormData(f => ({ ...f, [key]: value }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '4px', height: '28px', background: 'var(--low)', borderRadius: '4px' }} />
          <h1>Reception Desk</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem', fontSize: '0.9rem' }}>
          Register walk-in patients. AI engine automatically assigns priority and token.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Registration Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0' }}>New Patient Registration</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All fields marked with * are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Age *</label>
                <input required type="number" className="form-input" value={formData.age} onChange={e => setField('age', e.target.value)} placeholder="e.g. 34" min="0" max="120" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender *</label>
                <select className="form-select" value={formData.gender} onChange={e => setField('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number *</label>
                <input required type="tel" className="form-input" value={formData.phone} onChange={e => setField('phone', e.target.value)} placeholder="e.g. 555-0199" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Symptoms / Disease Description *</label>
              <textarea
                required className="form-input" rows="3"
                value={formData.symptoms}
                onChange={e => setField('symptoms', e.target.value)}
                placeholder="Describe symptoms in detail... (e.g. severe chest pain, shortness of breath)"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department *</label>
                <select className="form-select" value={formData.department} onChange={e => setField('department', e.target.value)}>
                  {(departments.length > 0 ? departments : ['General Medicine','Cardiology','Orthopedics','Pediatrics','Emergency']).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Visit Type</label>
                <select className="form-select" value={formData.visitType} onChange={e => setField('visitType', e.target.value)}>
                  <option value="new">New Consultation</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">
                <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Arrival Time <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(leave blank = now)</span>
              </label>
              <input type="datetime-local" className="form-input" value={formData.arrivalTime} onChange={e => setField('arrivalTime', e.target.value)} />
            </div>

            {/* Emergency Flag */}
            <div
              onClick={() => setField('isEmergency', !formData.isEmergency)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${formData.isEmergency ? 'var(--critical)' : 'var(--border-default)'}`,
                background: formData.isEmergency ? 'var(--critical-bg)' : 'var(--border-subtle)',
                cursor: 'pointer',
                marginTop: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <input type="checkbox" checked={formData.isEmergency} onChange={() => {}} style={{ width: '18px', height: '18px', accentColor: 'var(--critical)', cursor: 'pointer' }} />
              <div>
                <div style={{ fontWeight: '700', color: formData.isEmergency ? 'var(--critical)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertOctagon size={16} /> Flag as Emergency
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Immediately moves patient to Critical priority — overrides all queue positions</div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', fontSize: '0.9rem' }}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <><Zap size={16} /> Generate Token & Add to Queue</>
              )}
            </button>
          </form>
        </div>


        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Stats */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Today's Queue</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{patients.length}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--high-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--high)' }}>{patients.filter(p => p.status === 'waiting').length}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waiting</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--low-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--low)' }}>{patients.filter(p => p.status === 'completed').length}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
              </div>
            </div>
          </div>

          {/* AI Triage Info */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(168,85,247,0.08) 100%)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <Zap size={20} color="var(--primary)" />
              <h3 style={{ color: 'var(--primary)' }}>AI Triage Engine v2.0</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Enhanced multi-factor analysis: symptom combinations, age vulnerability, department urgency, and time-decay boosting. Returns <strong style={{ color: 'var(--text-primary)' }}>confidence scores</strong> with each assessment.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Critical', color: 'var(--critical)',  desc: 'Emergency override — immediate' },
                { label: 'High',     color: 'var(--high)',      desc: 'Score ≥ 60 — urgent symptoms' },
                { label: 'Medium',   color: 'var(--medium)',    desc: 'Score ≥ 30 — moderate case' },
                { label: 'Low',      color: 'var(--low)',       desc: 'Score < 30 — routine visit' },
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span className={`badge badge-${t.label.toLowerCase()}`}>{t.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Departments Status */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Department Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {(departments.length > 0 ? departments : ['General Medicine','Cardiology','Emergency']).map(d => {
                const deptWaiting = patients.filter(p => p.department === d && p.status === 'waiting').length;
                return (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{d}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {deptWaiting > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--high)', fontWeight: '600' }}>{deptWaiting} waiting</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--low)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={13} /> Open
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reception;
