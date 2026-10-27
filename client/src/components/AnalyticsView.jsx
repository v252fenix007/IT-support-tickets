import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  PieChart,
} from 'lucide-react';

export const AnalyticsView = ({ stats }) => {
  if (!stats) return null;

  const total = stats.total || 1;
  const resolvedRate = Math.round(((stats.resolved + stats.closed) / total) * 100) || 0;

  const categoryColors = {
    Hardware: '#00ED64',
    Software: '#61DAFB',
    Network: '#22c55e',
    'Access & Security': '#f59e0b',
    'Email & Cloud': '#38bdf8',
    Other: '#94a3b8',
  };

  const priorityColors = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#38bdf8',
    Low: '#10b981',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface-secondary) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            IT Operations & SLA Analytics
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time telemetry on organization ticket resolution velocity, category distributions, and support workload.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>Resolution Rate</div>
            <div style={{ fontSize: '1.85rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.1 }}>{resolvedRate}%</div>
          </div>
          <div style={{ width: '1px', height: '42px', background: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>Active Backlog</div>
            <div style={{ fontSize: '1.85rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--status-progress)', lineHeight: 1.1 }}>{(stats.open || 0) + (stats.inProgress || 0)}</div>
          </div>
        </div>
      </div>

      {/* Grid: Category & Priority Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Category Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-primary)" />
            Tickets by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.categoryStats?.map((cat) => {
              const count = cat.count;
              const pct = Math.round((count / total) * 100);
              const color = categoryColors[cat._id] || 'var(--accent-primary)';

              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat._id}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{count} tickets ({pct}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease',
                      boxShadow: `0 0 8px ${color}80`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="var(--accent-secondary)" />
            Tickets by Severity / Priority
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Critical', 'High', 'Medium', 'Low'].map((prio) => {
              const item = stats.priorityStats?.find((p) => p._id === prio);
              const count = item ? item.count : 0;
              const pct = Math.round((count / total) * 100);
              const color = priorityColors[prio] || 'var(--accent-secondary)';

              return (
                <div key={prio}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: color }}>{prio} Priority</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease',
                      boxShadow: `0 0 8px ${color}80`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
