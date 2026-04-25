import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  const [chartType, setChartType] = useState('default');

  if (!data || data.length === 0) return null;

  const isJunk = data[0].type === 'sales';
  const COLORS = ['#1e293b', '#334155', '#475569', '#0f172a', '#1e3a8a', '#1d4ed8', '#2563eb', '#0369a1', '#0e7490', '#15803d', '#3f6212', '#4c1d95'];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
          {isJunk ? 'Monthly Sales' : 'Monthly Revenue'}
        </h3>
        <select value={chartType} onChange={e => setChartType(e.target.value)} style={{padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-color)', outline: 'none', background: 'var(--content-bg)', fontFamily: 'var(--font-family)', color: 'var(--text-primary)'}}>
          <option value="default">{isJunk ? 'Bar Chart' : 'Line Chart'}</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="99%" height="100%">
          {chartType === 'pie' ? (
             <PieChart>
               <Pie data={data} dataKey="value" nameKey="month" cx="50%" cy="50%" outerRadius={100} label>
                 {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
               </Pie>
               <Tooltip />
             </PieChart>
          ) : isJunk ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Bar dataKey="value" fill="#9ca3af" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 2}} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
