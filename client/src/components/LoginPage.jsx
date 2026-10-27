import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  Headphones,
  AlertCircle,
  ArrowRight,
  Database,
  Cpu,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register, quickSwitch } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Marketing & Design');
  const [regRole, setRegRole] = useState('employee');

  const [loading, setLoading] = useState(false);
  const [switchingPersona, setSwitchingPersona] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all registration fields.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        department: regDepartment,
        role: regRole,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (targetEmail, personaKey) => {
    setErrorMessage('');
    setSwitchingPersona(personaKey);
    try {
      await quickSwitch(targetEmail);
    } catch (err) {
      setErrorMessage(err.message || 'Quick login failed.');
    } finally {
      setSwitchingPersona(null);
    }
  };

  // Pre-configured persona details
  const personas = [
    {
      key: 'alice',
      name: 'Alice Smith',
      email: 'alice.smith@company.com',
      role: 'Employee',
      roleKey: 'employee',
      department: 'Marketing & Design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badgeBg: 'var(--accent-cyan-light)',
      badgeBorder: 'var(--accent-cyan-border)',
      badgeColor: 'var(--accent-secondary)',
      description: 'Submit issues, track ticket progress, confirm resolutions',
      Icon: User,
    },
    {
      key: 'marcus',
      name: 'Marcus Vance',
      email: 'marcus.tech@company.com',
      role: 'Support Engineer',
      roleKey: 'engineer',
      department: 'IT Support & Systems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgeBg: 'var(--accent-light)',
      badgeBorder: 'var(--accent-border)',
      badgeColor: 'var(--accent-primary)',
      description: 'Accept triage queue, update ticket states, publish resolution notes',
      Icon: Headphones,
    },
    {
      key: 'sarah',
      name: 'Sarah Jenkins',
      email: 'admin.sarah@company.com',
      role: 'IT Administrator',
      roleKey: 'admin',
      department: 'IT Infrastructure & Security',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      badgeBorder: 'rgba(239, 68, 68, 0.28)',
      badgeColor: '#ef4444',
      description: 'Oversee all company tickets, SLA telemetry, analytics, team reassignments',
      Icon: ShieldCheck,
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% -10%, #e0f2fe 0%, #f8fafc 60%, #f1f5f9 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      fontFamily: 'var(--font-family)',
      position: 'relative',
    }}>
      {/* Decorative Top Accent Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--accent-gradient)',
        zIndex: 100,
      }} />

      <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.85rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)',
              color: '#ffffff',
            }}>
              <Terminal size={26} strokeWidth={2.5} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                ITDesk
                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-border)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}>
                  MERN STACK
                </span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.2rem',
              }}>
                <span style={{ color: 'var(--mern-mongo)', fontWeight: 700 }}>MongoDB</span>
                <span>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>Express</span>
                <span>•</span>
                <span style={{ color: 'var(--mern-react)', fontWeight: 700 }}>React</span>
                <span>•</span>
                <span style={{ color: 'var(--mern-node)', fontWeight: 700 }}>Node.js</span>
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0.5rem 0 0.25rem',
          }}>
            Enterprise IT Service Portal
          </h1>
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            Sign in to manage service tickets, monitor SLA telemetry, and collaborate with enterprise engineers.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div style={{
            maxWidth: '540px',
            margin: '0 auto 1.5rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: Form + Quick Personas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 450px) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Card 1: Sign In / Register Form */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}>
            {/* Tab Header */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              background: '#f8fafc',
            }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  fontSize: '0.88rem',
                  fontWeight: mode === 'login' ? 700 : 500,
                  color: mode === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: mode === 'login' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: mode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'var(--transition)',
                }}
              >
                <LogIn size={16} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  fontSize: '0.88rem',
                  fontWeight: mode === 'register' ? 700 : 500,
                  color: mode === 'register' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                  background: mode === 'register' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: mode === 'register' ? '2px solid var(--accent-secondary)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'var(--transition)',
                }}
              >
                <UserPlus size={16} />
                Create Account
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              {mode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}>
                      Corporate Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }} />
                      <input
                        type="email"
                        placeholder="e.g. alice.smith@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        Password
                      </label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Default: password123
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      marginTop: '0.5rem',
                      justifyContent: 'center',
                    }}
                  >
                    {loading ? (
                      'Authenticating...'
                    ) : (
                      <>
                        <span>Sign In to ITDesk</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="e.g. Jonathan Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Corporate Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        placeholder="e.g. jonathan.doe@company.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        placeholder="Choose a strong password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Department
                      </label>
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.65rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <option value="Marketing & Design">Marketing & Design</option>
                        <option value="Cloud & Network Ops">Cloud & Network Ops</option>
                        <option value="IT Support & Systems">IT Support & Systems</option>
                        <option value="Financial Analysis">Financial Analysis</option>
                        <option value="IT Infrastructure & Security">IT Security & Ops</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Workspace Role
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.65rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                        }}
                      >
                        <option value="employee">Employee</option>
                        <option value="engineer">Support Engineer</option>
                        <option value="admin">IT Admin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      marginTop: '0.5rem',
                      justifyContent: 'center',
                      background: 'var(--accent-cyan-light)',
                      color: 'var(--accent-secondary)',
                      borderColor: 'var(--accent-cyan-border)',
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Card 2: 1-Click Persona Access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Instant Persona Access
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-primary)',
                  background: 'var(--accent-light)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                }}>
                  1-CLICK DEMO
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                Explore the MERN IT Support desk instantly with pre-seeded enterprise accounts:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {personas.map((persona) => {
                  const Icon = persona.Icon;
                  const isSwitching = switchingPersona === persona.key;

                  return (
                    <div
                      key={persona.key}
                      onClick={() => handleQuickPersona(persona.email, persona.key)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = persona.badgeColor;
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: `url(${persona.avatar}) center/cover`,
                          border: `2px solid ${persona.badgeColor}`,
                          flexShrink: 0,
                        }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {persona.name}
                            </span>
                            <span style={{
                              fontSize: '0.64rem',
                              fontFamily: 'var(--font-mono)',
                              background: persona.badgeBg,
                              color: persona.badgeColor,
                              border: `1px solid ${persona.badgeBorder}`,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}>
                              {persona.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {persona.department} • <span style={{ fontFamily: 'var(--font-mono)' }}>{persona.email}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {persona.description}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSwitching}
                        className="btn btn-sm"
                        style={{
                          background: persona.badgeBg,
                          color: persona.badgeColor,
                          borderColor: persona.badgeBorder,
                          fontWeight: 700,
                          flexShrink: 0,
                          padding: '0.4rem 0.8rem',
                        }}
                      >
                        {isSwitching ? 'Loading...' : 'Launch →'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Telemetry Capsule */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--mern-mongo)', fontWeight: 700 }}>
                  <Database size={14} /> Mongoose DB
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--mern-react)', fontWeight: 700 }}>
                  <Cpu size={14} /> Express API
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Backend 200 OK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
