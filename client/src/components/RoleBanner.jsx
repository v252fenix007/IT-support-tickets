import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Wrench, Shield, ArrowRightLeft } from 'lucide-react';

export const RoleBanner = () => {
  const { user, demoUsers, quickSwitch } = useAuth();

  if (demoUsers.length === 0) return null;

  return (
    <div style={{
      background: 'var(--role-bg)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.55rem 1.5rem',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-xs)',
      transition: 'background-color 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--accent-primary)',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
        }}>
          <ArrowRightLeft size={13} />
          <span>Role Switcher:</span>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
          {user ? 'Test system permissions & role views:' : '⚠️ Click any role below to activate persona:'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {demoUsers.map((u) => {
          const isActive = user?.email === u.email;
          const isEngineer = u.role === 'engineer';
          const isAdmin = u.role === 'admin';

          // MERN Role Colors
          // Employee: React Cyan
          let icon = <UserCheck size={13} />;
          let roleTag = 'Employee';
          let activeBorder = 'var(--accent-cyan-border)';
          let activeBg = 'var(--accent-cyan-light)';
          let activeText = 'var(--accent-secondary)';
          let tagBg = 'var(--accent-cyan-light)';
          let tagText = 'var(--accent-secondary)';

          // Support Engineer: MongoDB Emerald Green
          if (isEngineer) {
            icon = <Wrench size={13} />;
            roleTag = 'Support Eng';
            activeBorder = 'var(--accent-border)';
            activeBg = 'var(--accent-light)';
            activeText = 'var(--accent-primary)';
            tagBg = 'var(--accent-light)';
            tagText = 'var(--accent-primary)';
          } else if (isAdmin) {
            // Admin: Security Red
            icon = <Shield size={13} />;
            roleTag = 'IT Admin';
            activeBorder = 'rgba(239, 68, 68, 0.4)';
            activeBg = 'rgba(239, 68, 68, 0.15)';
            activeText = '#ef4444';
            tagBg = 'rgba(239, 68, 68, 0.15)';
            tagText = '#ef4444';
          }

          return (
            <button
              key={u._id}
              onClick={() => quickSwitch(u.email)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.32rem 0.7rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? activeText : 'var(--text-secondary)',
                background: isActive ? activeBg : 'var(--bg-surface)',
                border: `1px solid ${isActive ? activeBorder : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
              title={`Switch to ${u.name} (${u.role})`}
            >
              <span style={{
                color: isActive ? activeText : (isEngineer ? 'var(--accent-primary)' : isAdmin ? '#ef4444' : 'var(--accent-secondary)'),
                display: 'flex',
                alignItems: 'center',
              }}>
                {icon}
              </span>
              <span>{u.name.split(' ')[0]}</span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                padding: '0.1rem 0.4rem',
                background: isActive ? tagBg : 'var(--bg-surface-secondary)',
                color: isActive ? tagText : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
              }}>
                {roleTag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
