import React from 'react';
import { useStore } from '../store/store';
import { generateAIInsights } from '../store/aiEngine';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info, Activity, Zap } from 'lucide-react';

const Analytics = () => {
  const { patients, departments, doctors } = useStore();
  const aiInsights = generateAIInsights(patients, doctors);

  // ── KPI Summary Row ──
  const totalToday = patients.length;
  const completedToday = patients.filter(p => p.status === 'completed').length;
  const avgWait = aiInsights.avgWait;
  const throughput = completedToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // ── 1. Department Load (Bar Chart) ──
  const deptData = departments.map(dept => ({
    name: dept.length > 10 ? dept.split(' ')[0] : dept,
    waiting: patients.filter(p => p.department === dept && p.status === 'waiting').length,
    consulting: patients.filter(p => p.department === dept && p.status === 'in-consultation').length,
    completed: patients.filter(p => p.department === dept && p.status === 'completed').length,
  }));

  // ── 2. Wait Time Trend (Line Chart) ──
  const waitTrendData = [
    { time: '08:00', wait: 8, patients: 3 },
    { time: '09:00', wait: 12, patients: 7 },
    { time: '10:00', wait: 18, patients: 12 },
    { time: '11:00', wait: 25, patients: 18 },
    { time: '12:00', wait: 35, patients: 22 },
    { time: '13:00', wait: 42, patients: 15 },
    { time: '14:00', wait: 30, patients: 20 },
    { time: '15:00', wait: 22, patients: 17 },
    { time: 'Now', wait: avgWait || 15, patients: patients.filter(p => p.status === 'waiting').length },
  ];

  // ── 3. Priority Distribution (Pie Chart) ──
  const priorityCounts = {
    Critical: patients.filter(p => p.priorityLevel === 'Critical').length,
    High: patients.filter(p => p.priorityLevel === 'High').length,
    Medium: patients.filter(p => p.priorityLevel === 'Medium').length,
    Low: patients.filter(p => p.priorityLevel === 'Low').length,
  };

  const priorityData = [
    { name: 'Critical', value: priorityCounts.Critical || 1, color: '#EF4444' },
    { name: 'High', value: priorityCounts.High || 3, color: '#F97316' },
    { name: 'Medium', value: priorityCounts.Medium || 8, color: '#EAB308' },
    { name: 'Low', value: priorityCounts.Low || 5, color: '#22C55E' },
  ];

  // ── 4. Doctor Workload (Bar Chart) ──
  const docWorkloadData = doctors.slice(0, 6).map(doc => ({
    name: doc.name.split(' ').pop(),
    completed: doc.patientsSeen || 0,
    pending: patients.filter(p => p.assignedDoctorId === doc.id && p.status === 'waiting').length,
    avgTime: doc.avgConsultTime || 15,
  }));

  // ── 5. Patient Flow (Area Chart) ──
  const flowData = [
    { time: '08:00', arrivals: 2, discharges: 0 },
    { time: '09:00', arrivals: 5, discharges: 1 },
    { time: '10:00', arrivals: 8, discharges: 3 },
    { time: '11:00', arrivals: 6, discharges: 5 },
    { time: '12:00', arrivals: 4, discharges: 7 },
    { time: '13:00', arrivals: 3, discharges: 4 },
    { time: '14:00', arrivals: 7, discharges: 6 },
    { time: '15:00', arrivals: 5, discharges: 8 },
    { time: 'Now', arrivals: patients.filter(p => p.status === 'waiting').length, discharges: completedToday },
  ];

  // ── 6. Department Radar (Radar Chart) ──
  const radarData = departments.slice(0, 6).map(dept => {
    const deptPatients = patients.filter(p => p.department === dept);
    const deptWaiting = deptPatients.filter(p => p.status === 'waiting').length;
    const deptAvgWait = deptPatients.length > 0
      ? Math.round(deptPatients.reduce((a, p) => a + (p.estimatedWaitTime || 0), 0) / deptPatients.length)
      : 0;
    return {
      department: dept.split(' ')[0],
      load: deptPatients.length * 10,
      waitTime: deptAvgWait,
      queueSize: deptWaiting * 15,
    };
  });

  // ── Insight icon helper ──
  const insightIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={16} color="var(--critical)" />;
      case 'warning': return <AlertTriangle size={16} color="var(--high)" />;
      case 'success': return <CheckCircle size={16} color="var(--low)" />;
      default: return <Info size={16} color="var(--primary)" />;
    }
  };

  const insightBg = (type) => {
    switch (type) {
      case 'critical': return 'var(--critical-bg)';
      case 'warning': return 'var(--high-bg)';
      case 'success': return 'var(--low-bg)';
      default: return 'var(--primary-light)';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, var(--primary), #a855f7)', borderRadius: '4px' }} />
          <h1>Analytics & AI Insights</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem', fontSize: '0.9rem' }}>
          Data-driven insights powered by AI triage engine — optimize hospital flow and reduce wait times.
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Patients', value: totalToday, icon: <Activity size={20} />, color: 'var(--primary)' },
          { label: 'Avg Wait Time', value: `${avgWait}m`, icon: <TrendingUp size={20} />, color: '#a855f7' },
          { label: 'Throughput Rate', value: `${throughput}%`, icon: <Zap size={20} />, color: 'var(--low)' },
          { label: 'AI Confidence', value: `${patients.length > 0 ? Math.round(patients.reduce((a, p) => a + (p.confidence || 65), 0) / patients.length) : 0}%`, icon: <Brain size={20} />, color: 'var(--high)' },
        ].map(kpi => (
          <div key={kpi.label} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{kpi.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(168,85,247,0.04) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Brain size={20} color="var(--primary)" />
          <h3 style={{ color: 'var(--primary)' }}>AI-Generated Insights</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {aiInsights.insights.map((insight, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: insightBg(insight.type), borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {insightIcon(insight.type)}
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{insight.message}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Busiest Dept</span>
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{aiInsights.busiestDept.name} ({aiInsights.busiestDept.count})</div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Busiest Doctor</span>
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{aiInsights.busiestDoctor.name} ({aiInsights.busiestDoctor.count})</div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Queue Status</span>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: aiInsights.totalWaiting > 5 ? 'var(--high)' : 'var(--low)' }}>{aiInsights.totalWaiting} waiting / {aiInsights.totalCompleted} done</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 — Wait Trend + Patient Flow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Average Wait Time Trend</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <LineChart data={waitTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="waitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="wait" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }} />
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} unit="m" />
                <Tooltip
                  contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#f0f6ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Patient Flow (Arrivals vs Discharges)</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <AreaChart data={flowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="arrivalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                <Area type="monotone" dataKey="arrivals" stroke="#3B82F6" fill="url(#arrivalGrad)" strokeWidth={2} name="Arrivals" />
                <Area type="monotone" dataKey="discharges" stroke="#22C55E" fill="url(#dischargeGrad)" strokeWidth={2} name="Discharges" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 — Priority Dist + Dept Load */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>AI Triage Distribution</h3>
          <div style={{ width: '100%', height: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
            {priorityData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}40` }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Department Load</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={deptData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                <Bar dataKey="waiting" name="Waiting" stackId="a" fill="#F97316" radius={[0, 0, 4, 4]} />
                <Bar dataKey="consulting" name="In Consult" stackId="a" fill="#3B82F6" />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 3 — Doctor Workload + Dept Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Doctor Workload</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={docWorkloadData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#f0f6ff', fontSize: 12, fontWeight: 500 }} width={80} />
                <Tooltip contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="pending" name="In Queue" fill="#F97316" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Department Performance Radar</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="department" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Patient Load" dataKey="load" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Wait Time" dataKey="waitTime" stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: '#141e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
