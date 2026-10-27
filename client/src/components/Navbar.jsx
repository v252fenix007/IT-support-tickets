import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LifeBuoy,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  ShieldCheck,
  Headphones,
  Ticket,
  Database,
  Zap,
  Atom,
  Server,
  Sun,
  Moon,
  Terminal,
} from 'lucide-react';

export const Navbar = ({ onOpenCreate, currentView, setCurrentView, theme, onToggleTheme }) => {
  const { user, logout, isEmployee, isEngineer, isAdmin } = useAuth();

  let roleColor = 'var(--accent-secondary)';
  let roleBg = 'var(--accent-cyan-light)';
  let roleBorder = 'var(--accent-cyan-border)';
  let roleLabel = 'Employee';
  let RoleIcon = User;

  if (isEngineer) {
    roleColor = 'var(--accent-primary)';
    roleBg = 'var(--accent-light)';
    roleBorder = 'var(--accent-border)';
    roleLabel = 'Support Engineer';
    RoleIcon = Headphones;
  } else if (isAdmin) {
    roleColor = '#ef4444';
    roleBg = 'rgba(239, 68, 68, 0.12)';
    roleBorder = 'rgba(239, 68, 68, 0.28)';
    roleLabel = 'IT Admin';
    RoleIcon = ShieldCheck;
  }

  return (
    <header style={{
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: '41px', // beneath RoleBanner
      zIndex: 90,
      padding: '0.65rem 1.5rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand & Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            onClick={() => setCurrentView('tickets')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)',
              color: '#ffffff',
            }}>
              <Terminal size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontSize: '1.18rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <span>ITDesk</span>
                <span style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-border)',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}>
                  MERN STACK
                </span>
              </div>
              <div style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <span style={{ color: 'var(--mern-mongo)', fontWeight: 700 }}>Mongo</span>
                <span>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>Express</span>
                <span>•</span>
                <span style={{ color: 'var(--mern-react)', fontWeight: 700 }}>React</span>
                <span>•</span>
                <span style={{ color: 'var(--mern-node)', fontWeight: 700 }}>Node</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setCurrentView('tickets')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: currentView === 'tickets' ? 700 : 500,
                color: currentView === 'tickets' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: currentView === 'tickets' ? 'var(--accent-light)' : 'transparent',
                border: `1px solid ${currentView === 'tickets' ? 'var(--accent-border)' : 'transparent'}`,
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'tickets') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'tickets') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Ticket size={15} />
              Ticket Queue
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: currentView === 'analytics' ? 700 : 500,
                color: currentView === 'analytics' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                background: currentView === 'analytics' ? 'var(--accent-cyan-light)' : 'transparent',
                border: `1px solid ${currentView === 'analytics' ? 'var(--accent-cyan-border)' : 'transparent'}`,
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'analytics') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'analytics') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <BarChart3 size={15} />
              Analytics & SLAs
            </button>
          </nav>
        </div>

        {/* Center: Live MERN Architecture Telemetry */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-surface)',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--mern-mongo)',
            fontWeight: 700,
          }}>
            <Database size={12} /> MongoDB
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}>
            <Zap size={12} /> Express
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--mern-react)',
            fontWeight: 700,
          }}>
            <Atom size={12} className="spin-slow" /> React 19
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--mern-node)',
            fontWeight: 600,
          }}>
            <Server size={12} /> Node
          </span>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            boxShadow: '0 0 6px var(--accent-primary)',
            marginLeft: '0.2rem',
          }} title="All microservices live" />
        </div>

        {/* Right side: Theme Switcher, Actions & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
            }}
            title={theme === 'dark' ? 'Switch to MERN Light' : 'Switch to MERN Cyber Dark'}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} color="#f59e0b" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} color="#61DAFB" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCreate}
            className="btn btn-primary"
            style={{ padding: '0.48rem 1rem', fontSize: '0.84rem' }}
          >
            <PlusCircle size={15} />
            Raise Ticket
          </button>

          {/* User Profile Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.3rem 0.7rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: user?.avatar ? `url(${user.avatar}) center/cover` : roleBg,
              border: `2px solid ${roleColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {!user?.avatar && <RoleIcon size={15} color={roleColor} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name || 'Demo User'}
                </span>
                <span style={{
                  fontSize: '0.63rem',
                  padding: '0.08rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: roleBg,
                  color: roleColor,
                  border: `1px solid ${roleBorder}`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}>
                  {roleLabel}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user?.department || 'Enterprise Staff'}
              </span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              style={{
                marginLeft: '0.2rem',
                color: 'var(--text-muted)',
                padding: '0.3rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
