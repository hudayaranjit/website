import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Users, Clock, AlertTriangle, Building2, Edit2, TrendingUp, X, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { patients, updatePatientDetails } = useStore();
  
  const [editingPatient, setEditingPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', age: '', symptoms: '' });

  const totalToday = patients.length;
  const waitingPatients = patients.filter(p => p.status === 'waiting').length;
  const inConsult = patients.filter(p => p.status === 'in-consultation').length;
  const waitTimes = patients.map(p => p.estimatedWaitTime || 0).filter(t => t > 0);
  const avgWaitTime = waitTimes.length > 0 ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
  const emergencies = patients.filter(p => p.priorityLevel === 'Critical').length;

  const handleEditClick = (p) => {
    setEditingPatient(p);
    setEditFormData({ name: p.name, age: p.age, symptoms: p.symptoms });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatientDetails(editingPatient.id, {
        name: editFormData.name,
        age: parseInt(editFormData.age),
        symptoms: editFormData.symptoms
      });
      setEditingPatient(null);
    }
  };

  const statusColor = (status) => {
    if (status === 'waiting') return 'var(--status-waiting)';
    if (status === 'in-consultation') return 'var(--status-consult)';
    if (status === 'completed') return 'var(--text-muted)';
    return 'var(--critical)';
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '4px', height: '28px', background: 'var(--primary)', borderRadius: '4px' }} />
          <h1>Hospital Command Center</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem', fontSize: '0.9rem' }}>
          Real-time AI-sorted patient queue overview across all departments
        </p>
      </div>

      {/* KPI Section */}
      <div className="kpi-grid">
        {/* Total Patients */}
        <div className="card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--primary)' }}>
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <h4>Total Patients</h4>
            <div className="kpi-value">{totalToday}</div>
          </div>
        </div>
        {/* Waiting */}
        <div className="card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--high)' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-content">
            <h4>In Waiting Room</h4>
            <div className="kpi-value" style={{ color: 'var(--high)' }}>{waitingPatients}</div>
          </div>
        </div>
        {/* Avg Wait */}
        <div className="card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(168,85,247,0.12)', color: '#a855f7' }}>
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <h4>Avg Wait Time</h4>
            <div className="kpi-value" style={{ color: '#a855f7' }}>{avgWaitTime}<span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>m</span></div>
          </div>
        </div>
        {/* Emergencies */}
        <div className="card kpi-card" style={emergencies > 0 ? { borderColor: 'var(--critical-border)', background: 'rgba(239,68,68,0.04)' } : {}}>
          <div className="kpi-icon" style={{ background: 'var(--critical-bg)', color: 'var(--critical)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-content">
            <h4 style={emergencies > 0 ? { color: 'var(--critical)' } : {}}>Emergencies</h4>
            <div className="kpi-value" style={{ color: emergencies > 0 ? 'var(--critical)' : 'inherit' }}>{emergencies}</div>
          </div>
        </div>
      </div>

      {/* Priority Queue Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={18} color="var(--primary)" />
            <h3>Global Priority Queue</h3>
            <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '700' }}>{patients.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-sorted by priority score</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>Token</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Status</th>
                <th>AI Priority</th>
                <th>Est. Wait</th>
                <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No patients in queue. Backend may be loading...
                  </td>
                </tr>
              ) : patients.slice(0, 20).map(p => (
                <tr key={p.id}>
                  <td style={{ paddingLeft: '1.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>{p.tokenNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.age}y · {p.gender} · {p.visitType}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.symptoms}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{p.department}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', fontSize: '0.8rem', color: statusColor(p.status) }}>
                      {p.status === 'in-consultation' ? '● In Consult' :
                       p.status === 'waiting'         ? '◌ Waiting' :
                       p.status === 'completed'       ? '✓ Done' : p.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${p.priorityLevel?.toLowerCase()}`}>{p.priorityLevel}</span>
                    {p.aiExplanation && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '3px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.aiExplanation}>
                        {p.aiExplanation}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: p.status === 'waiting' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {p.status === 'in-consultation' ? '— now' : p.status === 'completed' ? '—' : `${p.estimatedWaitTime || 0}m`}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }} onClick={() => handleEditClick(p)}>
                      <Edit2 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="modal-overlay" onClick={() => setEditingPatient(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3>Edit Patient Record</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Token: <strong style={{ color: 'var(--primary)' }}>{editingPatient.tokenNumber}</strong>
                </p>
              </div>
              <button onClick={() => setEditingPatient(null)} style={{ background: 'var(--border-subtle)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" value={editFormData.age} onChange={e => setEditFormData({...editFormData, age: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Symptoms / Disease</label>
                <textarea className="form-input" rows="3" value={editFormData.symptoms} onChange={e => setEditFormData({...editFormData, symptoms: e.target.value})} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPatient(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
