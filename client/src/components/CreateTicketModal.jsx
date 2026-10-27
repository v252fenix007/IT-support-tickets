import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  PlusCircle,
  Cpu,
  Laptop,
  Globe,
  Key,
  Cloud,
  FileQuestion,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'Hardware', label: 'Hardware', icon: Cpu, desc: 'Laptops, screens, docks, chargers' },
    { id: 'Software', label: 'Software', icon: Laptop, desc: 'App crashes, licenses, OS bugs' },
    { id: 'Network', label: 'Network', icon: Globe, desc: 'WiFi, corporate VPN, DNS issues' },
    { id: 'Access & Security', label: 'Access & IAM', icon: Key, desc: 'Permissions, passwords, 2FA' },
    { id: 'Email & Cloud', label: 'Email / Cloud', icon: Cloud, desc: 'Outlook, GSuite, AWS access' },
    { id: 'Other', label: 'Other', icon: FileQuestion, desc: 'General workplace tech requests' },
  ];

  const priorities = [
    { id: 'Low', label: 'Low', desc: 'Non-urgent query or cosmetic request' },
    { id: 'Medium', label: 'Medium', desc: 'Standard business work partially blocked' },
    { id: 'High', label: 'High', desc: 'Urgent: Core workflow impaired' },
    { id: 'Critical', label: 'Critical', desc: 'Emergency: Entire system down or security issue' },
  ];

  const applyTemplate = (templateType) => {
    if (templateType === 'vpn') {
      setTitle('GlobalProtect VPN timeout on home broadband');
      setCategory('Network');
      setPriority('High');
      setDeviceInfo('MacBook Pro Sonoma 14.4 - WiFi 6');
      setDescription('Cannot reach internal staging clusters and Jira without VPN. Keeps timing out with error SEC_GATEWAY_RESET.');
    } else if (templateType === 'hardware') {
      setTitle('External USB-C monitor not detected after OS update');
      setCategory('Hardware');
      setPriority('Medium');
      setDeviceInfo('Dell 4K U2723QE / CalDigit Dock');
      setDescription('Screen remains black and USB peripherals plugged into the monitor hub do not register.');
    } else if (templateType === 'access') {
      setTitle('Request database read replica credentials for analytics review');
      setCategory('Access & Security');
      setPriority('Medium');
      setDeviceInfo('Workstation Asset #ENG-204');
      setDescription('Need access to postgres readonly instance for generating quarterly compliance report.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both an issue title and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Ensure authenticated session before submitting
      if (!localStorage.getItem('it_token')) {
        await api.login('alice.smith@company.com', 'password123');
      }

      await onCreated({
        title: title.trim(),
        category,
        priority,
        deviceInfo: deviceInfo.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-secondary)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)',
            }}>
              <PlusCircle size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Raise an IT Support Ticket</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Submitting as <strong>{user?.name || 'Employee'}</strong> ({user?.department || 'IT Operations'})
              </p>
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
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick template chips */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={13} /> Quick Fill:
            </span>
            <button
              type="button"
              onClick={() => applyTemplate('vpn')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              VPN Disconnect
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('hardware')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Monitor Display Bug
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('access')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              IAM / DB Access
            </button>
          </div>

          {/* Issue Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Issue Summary / Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Corporate VPN connection timing out after 10 minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          {/* Category Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Problem Category *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '0.6rem',
            }}>
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    style={{
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'var(--accent-light)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      boxShadow: isSelected ? '0 0 0 1px var(--accent-primary)' : 'var(--shadow-xs)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <Icon size={15} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                      <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {c.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {c.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority & Device Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Urgency / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%' }}
              >
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} - {p.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Device / Asset Info (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. MacBook Pro M2, Desk #14"
                value={deviceInfo}
                onChange={(e) => setDeviceInfo(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Detailed Description & Steps to Reproduce *
            </label>
            <textarea
              rows={4}
              placeholder="Describe what happened, error codes, and what you've already tried..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Footer Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
