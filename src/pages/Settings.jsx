import React, { useState } from 'react';
import { useStore } from '../store/store';
import { Settings as SettingsIcon, Building2, Users, Brain, Bell, Info, Save, ChevronRight, Moon, Sun, RefreshCw, Shield } from 'lucide-react';

const Settings = () => {
  const { doctors, departments } = useStore();

  // Hospital Profile
  const [hospitalProfile, setHospitalProfile] = useState({
    name: 'City General Hospital',
    branch: 'Main Branch — Outpatient Department',
    phone: '+1 (555) 000-1234',
    email: 'admin@citygeneralhospital.com',
    opdHours: '08:00 AM — 06:00 PM',
    address: '123 Medical Center Drive, Healthcare City, HC 54321',
  });

  // AI Config
  const [aiConfig, setAiConfig] = useState({
    autoRefreshInterval: 15,
    criticalThreshold: 1000,
    highThreshold: 60,
    mediumThreshold: 30,
    enableCombos: true,
    enableTimedecay: true,
    enableDeptWeighting: true,
  });

  // Notification Prefs
  const [notifPrefs, setNotifPrefs] = useState({
    newPatient: true,
    statusChange: true,
    criticalAlert: true,
    queueEmpty: false,
    soundEnabled: true,
  });

  // Display
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'dark',
    animationsEnabled: true,
    compactMode: false,
    maxTableRows: 20,
  });

  const [activeSection, setActiveSection] = useState('hospital');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const sections = [
    { id: 'hospital', label: 'Hospital Profile', icon: <Building2 size={18} /> },
    { id: 'doctors', label: 'Doctor Management', icon: <Users size={18} /> },
    { id: 'ai', label: 'AI Engine Config', icon: <Brain size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'display', label: 'Display & Theme', icon: <Moon size={18} /> },
    { id: 'about', label: 'System Info', icon: <Info size={18} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'hospital':
        return (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Hospital Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input className="form-input" value={hospitalProfile.name} onChange={e => setHospitalProfile({...hospitalProfile, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Branch / Department</label>
                <input className="form-input" value={hospitalProfile.branch} onChange={e => setHospitalProfile({...hospitalProfile, branch: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={hospitalProfile.phone} onChange={e => setHospitalProfile({...hospitalProfile, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={hospitalProfile.email} onChange={e => setHospitalProfile({...hospitalProfile, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">OPD Hours</label>
                <input className="form-input" value={hospitalProfile.opdHours} onChange={e => setHospitalProfile({...hospitalProfile, opdHours: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={hospitalProfile.address} onChange={e => setHospitalProfile({...hospitalProfile, address: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Active Departments</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {departments.map(d => (
                  <span key={d} style={{ padding: '0.4rem 0.875rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(59,130,246,0.2)' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Doctor Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {doctors.map(doc => (
                <div key={doc.id} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.department} · Avg {doc.avgConsultTime}m/patient</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patients Seen</div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{doc.patientsSeen}</div>
                    </div>
                    <div style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: doc.status === 'active' ? 'var(--low-bg)' : 'var(--high-bg)',
                      color: doc.status === 'active' ? 'var(--low)' : 'var(--high)',
                      border: `1px solid ${doc.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.3)'}`,
                    }}>
                      {doc.status === 'active' ? '● Active' : '⏸ Break'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ai':
        return (
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>AI Triage Engine Configuration</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Configure the AI scoring thresholds and feature toggles. Changes affect how patients are triaged.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Auto-Refresh Interval (seconds)</label>
                <input type="number" className="form-input" value={aiConfig.autoRefreshInterval} onChange={e => setAiConfig({...aiConfig, autoRefreshInterval: parseInt(e.target.value)})} min="5" max="120" />
              </div>
              <div className="form-group">
                <label className="form-label">Critical Score Threshold</label>
                <input type="number" className="form-input" value={aiConfig.criticalThreshold} onChange={e => setAiConfig({...aiConfig, criticalThreshold: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">High Priority Threshold</label>
                <input type="number" className="form-input" value={aiConfig.highThreshold} onChange={e => setAiConfig({...aiConfig, highThreshold: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Medium Priority Threshold</label>
                <input type="number" className="form-input" value={aiConfig.mediumThreshold} onChange={e => setAiConfig({...aiConfig, mediumThreshold: parseInt(e.target.value)})} />
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Feature Toggles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'enableCombos', label: 'Dangerous Symptom Combinations', desc: 'Detect compound symptom patterns for escalated scoring' },
                { key: 'enableTimedecay', label: 'Time-Decay Priority Boost', desc: 'Gradually increase priority for patients waiting longer' },
                { key: 'enableDeptWeighting', label: 'Department Urgency Weighting', desc: 'Give baseline priority boost to high-urgency departments' },
              ].map(toggle => (
                <div key={toggle.key} onClick={() => setAiConfig({...aiConfig, [toggle.key]: !aiConfig[toggle.key]})} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--border-subtle)', border: '1px solid var(--border-default)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{toggle.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{toggle.desc}</div>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: aiConfig[toggle.key] ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.3s',
                    boxShadow: aiConfig[toggle.key] ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '2px',
                      left: aiConfig[toggle.key] ? '22px' : '2px',
                      transition: 'left 0.3s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'newPatient', label: 'New Patient Registration', desc: 'Alert when a new patient joins the queue' },
                { key: 'statusChange', label: 'Status Changes', desc: 'Alert when patient status changes (waiting → consultation → done)' },
                { key: 'criticalAlert', label: 'Critical Patient Alerts', desc: 'Immediate notification for emergency/critical patients' },
                { key: 'queueEmpty', label: 'Queue Empty Alert', desc: 'Notify when all patients have been seen' },
                { key: 'soundEnabled', label: 'Sound Notifications', desc: 'Play audio alerts alongside visual notifications' },
              ].map(pref => (
                <div key={pref.key} onClick={() => setNotifPrefs({...notifPrefs, [pref.key]: !notifPrefs[pref.key]})} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--border-subtle)', border: '1px solid var(--border-default)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{pref.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: notifPrefs[pref.key] ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.3s',
                    boxShadow: notifPrefs[pref.key] ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '2px',
                      left: notifPrefs[pref.key] ? '22px' : '2px',
                      transition: 'left 0.3s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'display':
        return (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Display & Theme</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="glass-card" onClick={() => setDisplaySettings({...displaySettings, theme: 'dark'})} style={{
                padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                border: displaySettings.theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                boxShadow: displaySettings.theme === 'dark' ? '0 0 20px rgba(59,130,246,0.2)' : 'none',
              }}>
                <Moon size={32} color={displaySettings.theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Dark Mode</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium glassmorphism theme</div>
              </div>
              <div className="glass-card" onClick={() => setDisplaySettings({...displaySettings, theme: 'light'})} style={{
                padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                border: displaySettings.theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-default)',
              }}>
                <Sun size={32} color={displaySettings.theme === 'light' ? 'var(--high)' : 'var(--text-muted)'} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Light Mode</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coming soon</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'animationsEnabled', label: 'Animations & Transitions', desc: 'Smooth page transitions and micro-animations' },
                { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce padding and spacing for more data density' },
              ].map(pref => (
                <div key={pref.key} onClick={() => setDisplaySettings({...displaySettings, [pref.key]: !displaySettings[pref.key]})} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--border-subtle)', border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{pref.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: displaySettings[pref.key] ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.3s',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '2px',
                      left: displaySettings[pref.key] ? '22px' : '2px',
                      transition: 'left 0.3s',
                    }} />
                  </div>
                </div>
              ))}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Max Table Rows</label>
                <select className="form-select" value={displaySettings.maxTableRows} onChange={e => setDisplaySettings({...displaySettings, maxTableRows: parseInt(e.target.value)})}>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>System Information</h3>
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.05))', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}>
                  <Brain size={32} color="white" />
                </div>
                <h2 style={{ marginBottom: '0.25rem' }}>MediQueue AI</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Intelligent Hospital Queue Management System</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Version', value: '2.0.0' },
                { label: 'AI Engine', value: 'v2.0 — Multi-Factor Triage' },
                { label: 'Database', value: 'Supabase (PostgreSQL)' },
                { label: 'Framework', value: 'React 19 + Vite 8' },
                { label: 'State Management', value: 'Zustand 5' },
                { label: 'Realtime', value: 'Supabase Realtime (WebSocket)' },
                { label: 'UI Library', value: 'Lucide Icons + Recharts' },
                { label: 'Last Updated', value: new Date().toLocaleDateString() },
              ].map(item => (
                <div key={item.label} style={{ padding: '0.875rem 1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Built with ❤️ using <strong style={{ color: 'var(--primary)' }}>Stitch MCP</strong> Design System
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '4px', height: '28px', background: 'var(--primary)', borderRadius: '4px' }} />
          <h1>Settings</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem', fontSize: '0.9rem' }}>
          Configure hospital profile, AI engine, notifications, and system preferences.
        </p>
      </div>

      {/* Save Message Toast */}
      {saveMessage && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000,
          padding: '0.875rem 1.5rem', background: 'var(--low)', color: 'white',
          borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.875rem',
          boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
          animation: 'fadeSlideUp 0.3s ease',
        }}>
          <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          {saveMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar Nav */}
        <div className="glass-card" style={{ padding: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeSection === section.id ? 'var(--primary-light)' : 'transparent',
                  color: activeSection === section.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeSection === section.id ? '600' : '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family)',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                {section.icon}
                {section.label}
                {activeSection === section.id && (
                  <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass-card">
          {renderContent()}

          {/* Save Button (not shown for About) */}
          {activeSection !== 'about' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.65rem 1.5rem' }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
