import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink,
  UserCheck,
  Clock,
  Laptop,
  Cpu,
  Globe,
  Key,
  Cloud,
  FileQuestion,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export const TicketTable = ({ tickets, onSelectTicket, onAcceptTicket }) => {
  const { isSupportStaff, user } = useAuth();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hardware': return <Cpu size={14} color="#00ED64" />;
      case 'Software': return <Laptop size={14} color="#61DAFB" />;
      case 'Network': return <Globe size={14} color="#22c55e" />;
      case 'Access & Security': return <Key size={14} color="#f59e0b" />;
      case 'Email & Cloud': return <Cloud size={14} color="#38bdf8" />;
      default: return <FileQuestion size={14} color="#94a3b8" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-in-progress';
      case 'Awaiting User': return 'badge-awaiting-user';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      default: return 'badge-open';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto',
        }}>
          <Clock size={24} color="var(--text-muted)" />
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>No matching tickets found</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          Try resetting the search terms, category, or priority filters to view more support tickets.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.88rem',
        }}>
          <thead>
            <tr style={{
              background: 'var(--bg-surface-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-mono)',
            }}>
              <th style={{ padding: '0.85rem 1.25rem', width: '120px' }}>Ticket #</th>
              <th style={{ padding: '0.85rem 1rem' }}>Issue & Category</th>
              <th style={{ padding: '0.85rem 1rem', width: '120px' }}>Priority</th>
              <th style={{ padding: '0.85rem 1rem', width: '130px' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', width: '160px' }}>Requester</th>
              <th style={{ padding: '0.85rem 1rem', width: '160px' }}>Assignee</th>
              <th style={{ padding: '0.85rem 1rem', width: '130px' }}>Created</th>
              <th style={{ padding: '0.85rem 1.25rem', width: '110px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => {
              const isAssignedToMe = Boolean(t.assignedTo?._id && user && (t.assignedTo._id === user._id || t.assignedTo._id === user.id));

              return (
                <tr
                  key={t._id}
                  onClick={() => onSelectTicket(t)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    background: 'var(--bg-card)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                >
                  {/* Ticket ID */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="mern-ticket-id">
                      {t.ticketNumber}
                    </span>
                  </td>

                  {/* Title & Category */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                      }}>
                        {getCategoryIcon(t.category)}
                        {t.category}
                      </span>
                      {t.deviceInfo && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          • {t.deviceInfo}
                        </span>
                      )}
                      {t.comments?.length > 0 && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem',
                          background: 'var(--bg-surface-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}>
                          <MessageSquare size={11} />
                          {t.comments.length}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <span className={`priority-badge ${getPriorityBadgeClass(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <span className={`badge ${getStatusBadgeClass(t.status)}`}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                      }} />
                      {t.status}
                    </span>
                  </td>

                  {/* Requester */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.84rem' }}>
                      {t.createdBy?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {t.department || t.createdBy?.department}
                    </div>
                  </td>

                  {/* Assignee */}
                  <td style={{ padding: '1rem 1rem' }}>
                    {t.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isAssignedToMe ? 'var(--accent-light)' : 'var(--bg-surface-secondary)',
                          border: `1px solid ${isAssignedToMe ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isAssignedToMe ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        }}>
                          {t.assignedTo.name.charAt(0)}
                        </div>
                        <span style={{
                          fontSize: '0.82rem',
                          color: isAssignedToMe ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontWeight: isAssignedToMe ? 700 : 500,
                        }}>
                          {isAssignedToMe ? 'Me' : t.assignedTo.name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      isSupportStaff ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptTicket(t._id);
                          }}
                          className="btn btn-sm"
                          style={{
                            background: 'var(--accent-light)',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--accent-border)',
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          title="Assign this ticket to myself"
                        >
                          <UserCheck size={13} />
                          Accept
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Unassigned
                        </span>
                      )
                    )}
                  </td>

                  {/* Created */}
                  <td style={{ padding: '1rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(t.createdAt)}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicket(t);
                      }}
                      style={{
                        color: 'var(--text-secondary)',
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid transparent',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-secondary)';
                        e.currentTarget.style.backgroundColor = 'var(--accent-cyan-light)';
                        e.currentTarget.style.borderColor = 'var(--accent-cyan-border)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <span>View</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
