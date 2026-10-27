import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickSwitch = useCallback(async (email) => {
    try {
      const res = await api.login(email, 'password123');
      if (res.success && res.user) {
        localStorage.setItem('it_token', res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.error('Quick switch failed:', err);
    }
    return null;
  }, []);

  // Listen for auto-synced user updates from api.js self-healing
  useEffect(() => {
    const handleUserSync = (e) => {
      if (e.detail) {
        setUser(e.detail);
      }
    };
    window.addEventListener('auth:user-synced', handleUserSync);
    return () => window.removeEventListener('auth:user-synced', handleUserSync);
  }, []);

  // Initialize auth state and fetch demo users
  useEffect(() => {
    const initAuth = async () => {
      try {
        const demoRes = await api.getDemoUsers();
        let loadedDemoUsers = [];
        if (demoRes.success && demoRes.users) {
          loadedDemoUsers = demoRes.users;
          setDemoUsers(demoRes.users);
        }

        const token = localStorage.getItem('it_token');
        let userLoaded = false;

        if (token) {
          try {
            const meRes = await api.getMe();
            if (meRes.success && meRes.user) {
              setUser(meRes.user);
              userLoaded = true;
            }
          } catch (tokenErr) {
            localStorage.removeItem('it_token');
          }
        }

        // If not logged in or token invalid, leave user as null so front login page is shown
        if (!userLoaded) {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('it_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('it_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('it_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('it_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoUsers,
        login,
        register,
        logout,
        quickSwitch,
        isEmployee: user?.role === 'employee',
        isEngineer: user?.role === 'engineer',
        isAdmin: user?.role === 'admin',
        isSupportStaff: user?.role === 'engineer' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
