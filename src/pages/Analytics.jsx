import React from 'react';
import { useStore } from '../store/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { patients, departments, doctors } = useStore();

  // Mock Data generation for charts based on current state + some historical padding
  
  // 1. Department Load (Bar Chart)
  const deptData = departments.map(dept => ({
    name: dept.split(' ')[0], // Shorten name
    waiting: patients.filter(p => p.department === dept && p.status === 'waiting').length,
    completed: patients.filter(p => p.department === dept && p.status === 'completed').length,
  }));

  // 2. Average Wait Time Trend (Line Chart)
  const waitTrendData = [
    { time: '09:00', wait: 12 },
    { time: '10:00', wait: 18 },
    { time: '11:00', wait: 25 },
    { time: '12:00', wait: 35 },
    { time: '13:00', wait: 42 },
    { time: '14:00', wait: 30 },
    { time: '15:00', wait: 22 },
    { time: '16:00', wait: Math.max(10, Math.floor(patients.reduce((acc, p) => acc + p.estimatedWaitTime, 0) / (patients.length || 1))) }, // Current simulated avg
  ];

  // 3. Priority Distribution (Pie Chart)
  const criticalCount = patients.filter(p => p.priorityLevel === 'Critical').length;
  const highCount = patients.filter(p => p.priorityLevel === 'High').length;
  const mediumCount = patients.filter(p => p.priorityLevel === 'Medium').length;
  const lowCount = patients.filter(p => p.priorityLevel === 'Low').length;
  
  const priorityData = [
    { name: 'Critical', value: criticalCount > 0 ? criticalCount : 1, color: 'var(--color-critical)' },
    { name: 'High', value: highCount > 0 ? highCount : 5, color: 'var(--color-high)' },
    { name: 'Medium', value: mediumCount > 0 ? mediumCount : 12, color: 'var(--color-medium)' },
    { name: 'Low', value: lowCount > 0 ? lowCount : 8, color: 'var(--color-low)' },
  ];

  // 4. Doctor Workload Comparison
  const docWorkloadData = doctors.slice(0, 5).map(doc => ({
    name: doc.name.split(' ')[1],
    patientsSeen: doc.patientsSeen,
    pending: patients.filter(p => p.assignedDoctorId === doc.id && p.status === 'waiting').length
  }));

  return (
    <div>
      <div className="mb-6">
        <h1>Analytics & Reports</h1>
        <p className="text-muted">Data-driven insights to optimize hospital flow and reduce wait times.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Wait Time Trend */}
        <div className="card">
          <h3 className="mb-4">Average Wait Time Trend (Today)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={waitTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="wait" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h3 className="mb-4">AI Triage Distribution</h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center', marginTop: '-20px' }}>
             {priorityData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }}></div>
                  {d.name} ({Math.round((d.value / priorityData.reduce((a, b) => a + b.value, 0)) * 100)}%)
                </div>
             ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Department Load */}
        <div className="card">
          <h3 className="mb-4">Department Load</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={deptData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--color-surface-hover)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="waiting" name="Waiting" stackId="a" fill="var(--color-status-waiting)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Workload */}
        <div className="card">
          <h3 className="mb-4">Active Doctor Workload</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={docWorkloadData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-main)', fontSize: 12, fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: 'var(--color-surface-hover)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="patientsSeen" name="Completed" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="pending" name="Waiting Queue" fill="var(--color-status-waiting)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
