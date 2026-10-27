import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  Flame,
  Archive,
  AlertOctagon,
  Send,
  Lock,
  MessageSquare,
  History,
  ShieldCheck,
  Laptop,
  Check,
  RotateCcw,
} from 'lucide-react';

export const TicketDetailModal = ({
  ticket,
  onClose,
  onAccept,
  onUpdateStatus,
  onUpdatePriority,
  onAddComment,
}) => {
  const { user, isSupportStaff } = useAuth();

  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'history'
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Resolution modal state
  const [showResolvePrompt, setShowResolvePrompt] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');

  if (!ticket) return null;

  const isAssignedToMe = Boolean(ticket.assignedTo?._id && user && (ticket.assignedTo._id === user._id || ticket.assignedTo._id === user.id));

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await onAddComment(ticket._id, commentText.trim(), isInternalNote);
      setCommentText('');
      setIsInternalNote(false);
    } catch (err) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusSelect = (newStatus) => {
    if (newStatus === 'Resolved') {
      setShowResolvePrompt(true);
    } else {
      onUpdateStatus(ticket._id, newStatus);
    }
  };

  const confirmResolution = () => {
    onUpdateStatus(ticket._id, 'Resolved', resolutionSummary);
    setShowResolvePrompt(false);
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
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status Stepper stages
  const stages = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const currentStageIndex = stages.indexOf(ticket.status === 'Awaiting User' ? 'In Progress' : ticket.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'var(--bg-surface-secondary)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                background: 'var(--accent-light)',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid #c7d2fe',
              }}>
                {ticket.ticketNumber}
              </span>

              <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>

              <span className={`priority-badge ${getPriorityBadgeClass(ticket.priority)}`}>
                {ticket.priority} Priority
              </span>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {ticket.category}
              </span>
            </div>

            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {ticket.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Submitted by <strong style={{ color: 'var(--text-primary)' }}>{ticket.createdBy?.name}</strong></span>
              <span>•</span>
              <span>{ticket.department || ticket.createdBy?.department}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Status Stepper */}
        <div style={{
          padding: '1rem 1.75rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={stage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isCompleted || isCurrent ? 1 : 0.5,
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--accent-primary)' : isCurrent ? 'var(--accent-secondary)' : 'var(--bg-surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isCompleted || isCurrent ? '#080c15' : 'var(--text-muted)',
                  border: isCompleted || isCurrent ? 'none' : '1px solid var(--border-medium)',
                }}>
                  {isCompleted ? <Check size={14} color="#080c15" /> : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? 'var(--accent-secondary)' : isCompleted ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}>
                  {stage}
                </span>
                {idx < stages.length - 1 && (
                  <div style={{
                    width: '36px',
                    height: '2px',
                    background: isCompleted ? '#059669' : 'var(--border-subtle)',
                    marginLeft: '0.5rem',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ROLE ACTION CONTROLS */}
        <div style={{
          padding: '0.85rem 1.75rem',
          background: '#f8fafc',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          {/* Left: Support Engineer Controls */}
          {isSupportStaff ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Accept Ticket button */}
              {!isAssignedToMe && (
                <button
                  onClick={() => onAccept(ticket._id)}
                  className="btn btn-sm"
                  style={{
                    background: '#fffbeb',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                    fontWeight: 600,
                  }}
                >
                  <UserCheck size={14} />
                  Accept Ticket (Assign to Me)
                </button>
              )}

              {/* Status Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusSelect(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', background: 'var(--bg-input)' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting User">Awaiting User</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
                <select
                  value={ticket.priority}
                  onChange={(e) => onUpdatePriority(ticket._id, e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', background: 'var(--bg-input)' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Quick Resolve Button if not resolved */}
              {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                <button
                  onClick={() => setShowResolvePrompt(true)}
                  className="btn btn-sm btn-success"
                  style={{ fontWeight: 700 }}
                >
                  <CheckCircle2 size={14} />
                  Resolve Issue
                </button>
              )}
            </div>
          ) : (
            // Employee View Controls
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Assigned Engineer: <strong style={{ color: 'var(--text-primary)' }}>{ticket.assignedTo?.name || 'In Triage Queue'}</strong>
              </span>

              {/* Employee can mark ticket resolved if problem is fixed */}
              {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                <button
                  onClick={() => setShowResolvePrompt(true)}
                  className="btn btn-sm"
                  style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                  title="Mark this ticket as resolved"
                >
                  <CheckCircle2 size={15} />
                  Mark as Resolved
                </button>
              )}

              {ticket.status === 'Resolved' && (
                <>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}>
                    <CheckCircle2 size={14} />
                    Issue Resolved
                  </span>
                  <button
                    onClick={() => onUpdateStatus(ticket._id, 'Closed')}
                    className="btn btn-sm btn-success"
                  >
                    <CheckCircle2 size={14} />
                    Confirm & Close Ticket
                  </button>
                </>
              )}

              {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                <button
                  onClick={() => onUpdateStatus(ticket._id, 'Open')}
                  className="btn btn-sm btn-secondary"
                >
                  <RotateCcw size={14} />
                  Reopen Ticket
                </button>
              )}
            </div>
          )}

          {/* Right: Quick Engineer Indicator */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {ticket.assignedTo ? (
              <span>Handled by <strong style={{ color: 'var(--accent-primary)' }}>{ticket.assignedTo.name}</strong></span>
            ) : (
              <span style={{ color: '#d97706', fontWeight: 600 }}>⚠️ Not yet assigned</span>
            )}
          </div>
        </div>

        {/* Modal Body Container */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Resolution Prompt Box (if triggered) */}
          {showResolvePrompt && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}>
              <h4 style={{ color: '#059669', fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} />
                Provide Resolution Summary
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Explain the fix or steps taken to resolve the employee's issue:
              </p>
              <textarea
                rows={3}
                placeholder="e.g. Replaced Thunderbolt cable, updated display drivers, and verified dual monitor output."
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                style={{ width: '100%', marginBottom: '0.75rem', background: 'var(--bg-input)' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowResolvePrompt(false)}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResolution}
                  className="btn btn-sm btn-success"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          )}

          {/* Resolution Summary Banner (if already resolved) */}
          {ticket.resolutionSummary && (
            <div style={{
              background: 'var(--status-resolved-bg)',
              border: '1px solid var(--status-resolved-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}>
              <CheckCircle2 size={20} color="var(--status-resolved)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-resolved)', marginBottom: '0.2rem' }}>
                  Resolution Summary:
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {ticket.resolutionSummary}
                </div>
              </div>
            </div>
          )}

          {/* Issue Details Card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <h3 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 700 }}>
              Issue Description
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {ticket.description}
            </p>

            {ticket.deviceInfo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}>
                <Laptop size={15} color="var(--accent-primary)" />
                <span>Device / Workstation: <strong style={{ color: 'var(--text-primary)' }}>{ticket.deviceInfo}</strong></span>
              </div>
            )}
          </div>

          {/* Conversation & Activity Tabs */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
            }}>
              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'comments' ? 700 : 500,
                  color: activeTab === 'comments' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${activeTab === 'comments' ? 'var(--accent-primary)' : 'transparent'}`,
                  transition: 'var(--transition)',
                }}
              >
                <MessageSquare size={16} />
                Activity & Conversation ({ticket.comments?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'history' ? 700 : 500,
                  color: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${activeTab === 'history' ? 'var(--accent-primary)' : 'transparent'}`,
                  transition: 'var(--transition)',
                }}
              >
                <History size={16} />
                Audit Trail ({ticket.activityLog?.length || 0})
              </button>
            </div>

            {/* Tab 1: Comments */}
            {activeTab === 'comments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Comments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {ticket.comments?.length === 0 ? (
                    <div style={{
                      padding: '1.75rem',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      No conversation replies yet. Be the first to leave a message.
                    </div>
                  ) : (
                    ticket.comments.map((comment) => {
                      const isInternal = comment.isInternal;
                      const isFromSupport = comment.userRole === 'engineer' || comment.userRole === 'admin';

                      return (
                        <div
                          key={comment._id}
                          style={{
                            background: isInternal
                              ? 'rgba(245, 158, 11, 0.12)'
                              : isFromSupport
                              ? 'var(--accent-cyan-light)'
                              : 'var(--bg-surface)',
                            border: `1px solid ${
                              isInternal
                                ? 'rgba(245, 158, 11, 0.3)'
                                : isFromSupport
                                ? 'var(--accent-cyan-border)'
                                : 'var(--border-subtle)'
                            }`,
                            borderRadius: 'var(--radius-md)',
                            padding: '0.9rem 1.1rem',
                            boxShadow: 'var(--shadow-xs)',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.4rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                {comment.userName}
                              </span>
                              <span style={{
                                fontSize: '0.68rem',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '4px',
                                background: isFromSupport ? 'var(--accent-cyan-light)' : 'var(--bg-surface-secondary)',
                                color: isFromSupport ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                textTransform: 'capitalize',
                                fontWeight: 700,
                              }}>
                                {comment.userRole}
                              </span>

                              {isInternal && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.68rem',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '4px',
                                  background: 'rgba(245, 158, 11, 0.2)',
                                  color: 'var(--status-progress)',
                                  fontWeight: 700,
                                }}>
                                  <Lock size={10} />
                                  Support Staff Only
                                </span>
                              )}
                            </div>

                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                            {comment.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Comment Box */}
                <form onSubmit={handleSendComment} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <textarea
                    rows={3}
                    placeholder="Type your response or update here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    style={{ width: '100%', resize: 'vertical', background: 'var(--bg-input)' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isSupportStaff ? (
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        color: isInternalNote ? 'var(--status-progress)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}>
                        <input
                          type="checkbox"
                          checked={isInternalNote}
                          onChange={(e) => setIsInternalNote(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <Lock size={13} />
                        Post as Internal Tech Note (Hidden from Employee)
                      </label>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Visible to the IT Support Team
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="btn btn-sm btn-primary"
                    >
                      <Send size={14} />
                      {submittingComment ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Audit History */}
            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ticket.activityLog?.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.85rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.action}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                        {log.details}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
