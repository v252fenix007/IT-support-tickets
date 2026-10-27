import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, LayoutGrid, List, X } from 'lucide-react';

export const TicketFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  priority,
  setPriority,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onResetFilters,
}) => {
  const { isSupportStaff } = useAuth();

  const categories = ['All', 'Hardware', 'Software', 'Network', 'Access & Security', 'Email & Cloud', 'Other'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const tabs = isSupportStaff
    ? [
        { id: 'all', label: 'All Tickets' },
        { id: 'unassigned', label: '⚡ Unassigned Queue' },
        { id: 'assigned_to_me', label: 'My Assigned' },
        { id: 'Open', label: 'Open' },
        { id: 'In Progress', label: 'In Progress' },
        { id: 'Resolved', label: 'Resolved' },
      ]
    : [
        { id: 'all', label: 'All My Tickets' },
        { id: 'Open', label: 'Open' },
        { id: 'In Progress', label: 'In Progress' },
        { id: 'Resolved', label: 'Resolved' },
        { id: 'Closed', label: 'Closed' },
      ];

  const hasActiveFilters = category !== 'All' || priority !== 'All' || search.trim() !== '';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.15rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    }}>
      {/* Top row: Tabs & View Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.85rem',
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#080c15' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-gradient)' : 'var(--bg-surface-secondary)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? 'var(--accent-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface-secondary)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: viewMode === 'table' ? 700 : 500,
              color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
              boxShadow: viewMode === 'table' ? 'var(--shadow-xs)' : 'none',
            }}
            title="Table View"
          >
            <List size={15} />
            Table
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: viewMode === 'kanban' ? 700 : 500,
              color: viewMode === 'kanban' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent',
              boxShadow: viewMode === 'kanban' ? 'var(--shadow-xs)' : 'none',
            }}
            title="Kanban Board View"
          >
            <LayoutGrid size={15} />
            Kanban
          </button>
        </div>
      </div>

      {/* Bottom row: Search & Dropdown Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '450px',
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search tickets by ID, title, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.3rem',
              fontSize: '0.85rem',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#ef4444',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)')}
            >
              <X size={13} />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
