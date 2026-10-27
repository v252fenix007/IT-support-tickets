import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  Clock,
  CheckCircle,
  AlertOctagon,
  UserCheck,
  Flame,
} from 'lucide-react';

export const StatCards = ({ stats, activeFilter, onSelectFilter }) => {
  const { isSupportStaff } = useAuth();

  if (!stats) return null;

  const cards = [
    {
      id: 'All',
      label: 'Total Tickets',
      value: stats.total || 0,
      icon: Inbox,
      color: 'var(--accent-primary)',
      bg: 'var(--accent-light)',
      border: 'var(--accent-border)',
    },
    {
      id: 'Open',
      label: 'Open (Pending)',
      value: stats.open || 0,
      icon: Clock,
      color: 'var(--status-open)',
      bg: 'var(--status-open-bg)',
      border: 'var(--status-open-border)',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: stats.inProgress || 0,
      icon: Flame,
      color: 'var(--status-progress)',
      bg: 'var(--status-progress-bg)',
      border: 'var(--status-progress-border)',
    },
    {
      id: 'Critical',
      label: 'Critical Priority',
      value: stats.critical || 0,
      icon: AlertOctagon,
      color: 'var(--priority-critical)',
      bg: 'var(--priority-critical-bg)',
      border: 'var(--priority-critical-border)',
      isUrgent: (stats.critical || 0) > 0,
    },
    {
      id: 'Resolved',
      label: 'Resolved',
      value: (stats.resolved || 0) + (stats.closed || 0),
      icon: CheckCircle,
      color: 'var(--status-resolved)',
      bg: 'var(--status-resolved-bg)',
      border: 'var(--status-resolved-border)',
    },
  ];

  if (isSupportStaff) {
    cards.splice(1, 0, {
      id: 'assigned_to_me',
      label: 'Assigned To Me',
      value: stats.myAssigned || 0,
      icon: UserCheck,
      color: 'var(--accent-secondary)',
      bg: 'var(--accent-cyan-light)',
      border: 'var(--accent-cyan-border)',
    });
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
      gap: '1.1rem',
      marginBottom: '1.75rem',
    }}>
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            style={{
              background: isSelected ? card.bg : 'var(--bg-card)',
              border: `1px solid ${isSelected ? card.color : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'var(--transition)',
              boxShadow: isSelected
                ? `0 0 16px ${card.color}, var(--shadow-sm)`
                : 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = card.border;
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                marginBottom: '0.35rem',
                letterSpacing: '-0.01em',
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: '1.85rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>
                {card.value}
              </div>
            </div>

            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: card.bg,
              border: `1px solid ${card.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={22} color={card.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
