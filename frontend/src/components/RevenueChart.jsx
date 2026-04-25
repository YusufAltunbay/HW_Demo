import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const isJunk = data[0].type === 'sales';

  return (
    <div className="card">
      <h3 style={{ marginBottom: 15, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {isJunk ? 'Monthly Sales' : 'Monthly Revenue'}
      </h3>
      <div className="chart-container">
        <ResponsiveContainer width="99%" height="100%">
          {isJunk ? (
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
