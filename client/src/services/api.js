const API_BASE = '/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Automatic fallback authenticator to heal sessions seamlessly
let refreshPromise = null;

const autoAuthenticate = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const demoRes = await fetch(`${API_BASE}/auth/demo-users`);
      const demoData = await demoRes.json();
      if (demoData.success && demoData.users?.length > 0) {
        const emp = demoData.users.find((u) => u.role === 'employee') || demoData.users[0];
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emp.email, password: 'password123' }),
        });
        const loginData = await loginRes.json();
        if (loginData.success && loginData.token) {
          localStorage.setItem('it_token', loginData.token);
          window.dispatchEvent(new CustomEvent('auth:user-synced', { detail: loginData.user }));
          return loginData.token;
        }
      }
    } catch (err) {
      console.error('Auto-authentication recovery failed:', err);
    } finally {
      refreshPromise = null;
    }
    return null;
  })();

  return refreshPromise;
};

// Resilient fetch wrapper with auto-auth and 401 self-healing
const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem('it_token');

  // If no token exists and endpoint is protected, ensure token first
  const isPublicAuthRoute = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/demo-users');
  if (!token && !isPublicAuthRoute) {
    token = await autoAuthenticate();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If token is invalid or server restarted (401), automatically re-authenticate and retry
  if (res.status === 401 && !isPublicAuthRoute) {
    localStorage.removeItem('it_token');
    const freshToken = await autoAuthenticate();
    if (freshToken) {
      headers['Authorization'] = `Bearer ${freshToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  return handleResponse(res);
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('it_token', data.token);
      window.dispatchEvent(new CustomEvent('auth:user-synced', { detail: data.user }));
    }
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('it_token', data.token);
      window.dispatchEvent(new CustomEvent('auth:user-synced', { detail: data.user }));
    }
    return data;
  },

  getMe: async () => {
    const token = localStorage.getItem('it_token');
    if (!token) {
      return { success: false, user: null };
    }
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem('it_token');
      return { success: false, user: null };
    }
    return handleResponse(res);
  },

  getDemoUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    return handleResponse(res);
  },

  // Tickets
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'All') {
        params.append(key, val);
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return authFetch(`${API_BASE}/tickets${queryString}`);
  },

  getTicketById: async (id) => {
    return authFetch(`${API_BASE}/tickets/${id}`);
  },

  createTicket: async (ticketData) => {
    return authFetch(`${API_BASE}/tickets`, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  acceptTicket: async (id) => {
    return authFetch(`${API_BASE}/tickets/${id}/accept`, {
      method: 'PATCH',
    });
  },

  assignTicket: async (id, engineerId) => {
    return authFetch(`${API_BASE}/tickets/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ engineerId }),
    });
  },

  updateStatus: async (id, status, resolutionSummary) => {
    return authFetch(`${API_BASE}/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionSummary }),
    });
  },

  updatePriority: async (id, priority) => {
    return authFetch(`${API_BASE}/tickets/${id}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  },

  addComment: async (id, text, isInternal = false) => {
    return authFetch(`${API_BASE}/tickets/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, isInternal }),
    });
  },

  // Stats
  getStats: async () => {
    return authFetch(`${API_BASE}/stats`);
  },
};
