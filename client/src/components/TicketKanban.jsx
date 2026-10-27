import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Flame,
  CheckCircle2,
  Archive,
  UserCheck,
  ChevronRight,
  MessageSquare,
  AlertOctagon,
} from 'lucide-react';

export const TicketKanban = ({ tickets, onSelectTicket, onAcceptTicket }) => {
  const { isSupportStaff, user } = useAuth();

  const columns = [
    { id: 'Open', title: 'Open', color: 'var(--status-open)', bg: 'var(--status-open-bg)', border: 'var(--status-open-border)', icon: Clock },
    { id: 'In Progress', title: 'In Progress', color: 'var(--status-progress)', bg: 'var(--status-progress-bg)', border: 'var(--status-progress-border)', icon: Flame },
    { id: 'Awaiting User', title: 'Awaiting User', color: 'var(--status-awaiting)', bg: 'var(--status-awaiting-bg)', border: 'var(--status-awaiting-border)', icon: Clock },
    { id: 'Resolved', title: 'Resolved', color: 'var(--status-resolved)', bg: 'var(--status-resolved-bg)', border: 'var(--status-resolved-border)', icon: CheckCircle2 },
    { id: 'Closed', title: 'Closed', color: 'var(--status-closed)', bg: 'var(--status-closed-bg)', border: 'var(--status-closed-border)', icon: Archive },
  ];

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.25rem',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '1rem',
    }}>
      {columns.map((col) => {
        const Icon = col.icon;
        const colTickets = tickets.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 250px)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            {/* Column Header */}
            <div style={{
              padding: '0.85rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} color={col.color} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {col.title}
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: col.color,
                background: col.bg,
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${col.border}`,
              }}>
                {colTickets.length}
              </span>
            </div>

            {/* Ticket Cards List */}
            <div style={{
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              overflowY: 'auto',
            }}>
              {colTickets.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                }}>
                  No tickets
                </div>
              ) : (
                colTickets.map((t) => {
                  const isAssignedToMe = Boolean(t.assignedTo?._id && user && (t.assignedTo._id === user._id || t.assignedTo._id === user.id));

                  return (
                    <div
                      key={t._id}
                      onClick={() => onSelectTicket(t)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.9rem',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 237, 100, 0.25), var(--shadow-md)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Card Top: Ticket # & Priority */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="mern-ticket-id" style={{ fontSize: '0.75rem', padding: '0.12rem 0.45rem' }}>
                          {t.ticketNumber}
                        </span>
                        <span className={`priority-badge ${getPriorityBadgeClass(t.priority)}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          {t.priority}
                        </span>
                      </div>

                      {/* Card Title */}
                      <div style={{
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {t.title}
                      </div>

                      {/* Category & Requester */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                      }}>
                        <span>{t.category}</span>
                        <span>{t.createdBy?.name?.split(' ')[0]}</span>
                      </div>

                      {/* Card Footer: Assignee & Action */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.5rem',
                        marginTop: '0.2rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {t.assignedTo ? (
                            <span style={{
                              fontSize: '0.74rem',
                              color: isAssignedToMe ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              fontWeight: isAssignedToMe ? 700 : 500,
                            }}>
                              👤 {isAssignedToMe ? 'Me' : t.assignedTo.name.split(' ')[0]}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: 'var(--status-progress)', fontWeight: 600 }}>
                              Unassigned
                            </span>
                          )}
                        </div>

                        {t.comments?.length > 0 && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-surface-secondary)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}>
                            <MessageSquare size={11} />
                            {t.comments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
