import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RoleBanner } from './components/RoleBanner';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { TicketFilters } from './components/TicketFilters';
import { TicketTable } from './components/TicketTable';
import { TicketKanban } from './components/TicketKanban';
import { CreateTicketModal } from './components/CreateTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { AnalyticsView } from './components/AnalyticsView';
import { api } from './services/api';

function MainApp() {
  const { user, loading: authLoading } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [currentView, setCurrentView] = useState('tickets'); // 'tickets' | 'analytics'

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // MERN Theme Mode ('light' | 'dark') - Defaults to White Theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('it_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load tickets and stats
  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const filterParams = {
        search,
        category,
        priority,
      };

      if (activeTab === 'unassigned') {
        filterParams.filter = 'unassigned';
      } else if (activeTab === 'assigned_to_me') {
        filterParams.filter = 'assigned_to_me';
      } else if (activeTab !== 'all') {
        filterParams.status = activeTab;
      }

      const [ticketsRes, statsRes] = await Promise.all([
        api.getTickets(filterParams),
        api.getStats(),
      ]);

      if (ticketsRes.success) {
        setTickets(ticketsRes.tickets);
        // If ticket detail modal is open, refresh selected ticket
        if (selectedTicket) {
          const updatedSelected = ticketsRes.tickets.find((t) => t._id === selectedTicket._id);
          if (updatedSelected) {
            setSelectedTicket(updatedSelected);
          }
        }
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load tickets/stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user, search, category, priority, activeTab, selectedTicket?._id]);

  useEffect(() => {
    fetchData();
  }, [user, search, category, priority, activeTab]);

  // Handler: Create Ticket
  const handleCreateTicket = async (ticketData) => {
    const res = await api.createTicket(ticketData);
    if (res.success) {
      await fetchData();
      setSelectedTicket(res.ticket);
    }
  };

  // Handler: Accept Ticket
  const handleAcceptTicket = async (ticketId) => {
    try {
      const res = await api.acceptTicket(ticketId);
      if (res.success) {
        await fetchData();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
      }
    } catch (err) {
      alert(err.message || 'Error accepting ticket');
    }
  };

  // Handler: Update Status
  const handleUpdateStatus = async (ticketId, status, resolutionSummary) => {
    try {
      const res = await api.updateStatus(ticketId, status, resolutionSummary);
      if (res.success) {
        await fetchData();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  // Handler: Update Priority
  const handleUpdatePriority = async (ticketId, prio) => {
    try {
      const res = await api.updatePriority(ticketId, prio);
      if (res.success) {
        await fetchData();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
      }
    } catch (err) {
      alert(err.message || 'Error updating priority');
    }
  };

  // Handler: Add Comment
  const handleAddComment = async (ticketId, text, isInternal) => {
    const res = await api.addComment(ticketId, text, isInternal);
    if (res.success) {
      await fetchData();
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(res.ticket);
      }
    }
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPriority('All');
    setActiveTab('all');
  };

  // Select metric card filter
  const handleSelectStatFilter = (filterId) => {
    setActiveTab(filterId);
    if (currentView !== 'tickets') {
      setCurrentView('tickets');
    }
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }}>
        Loading ITDesk Workspace...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      {/* 1-Click Role Switcher */}
      <RoleBanner />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenCreate={() => setIsCreateOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Body */}
      <main className="main-content">
        {/* Metric Cards */}
        <StatCards
          stats={stats}
          activeFilter={activeTab}
          onSelectFilter={handleSelectStatFilter}
        />

        {currentView === 'tickets' ? (
          <>
            {/* Filter Bar */}
            <TicketFilters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              priority={priority}
              setPriority={setPriority}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onResetFilters={handleResetFilters}
            />

            {/* List / Board Content */}
            {viewMode === 'table' ? (
              <TicketTable
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                onAcceptTicket={handleAcceptTicket}
              />
            ) : (
              <TicketKanban
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                onAcceptTicket={handleAcceptTicket}
              />
            )}
          </>
        ) : (
          /* Analytics & SLA Telemetry */
          <AnalyticsView stats={stats} />
        )}
      </main>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreateTicket}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAccept={handleAcceptTicket}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
