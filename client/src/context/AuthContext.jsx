import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { loginUser, registerUser, logoutUser, fetchMe, refreshAccessToken } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up Authorization header in Axios client whenever token updates
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Initial check: attempt to restore session via refresh cookie or /auth/me
  useEffect(() => {
    async function checkAuth() {
      try {
        const freshToken = await refreshAccessToken();
        if (freshToken) {
          setToken(freshToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${freshToken}`;
          const profile = await fetchMe();
          setUser(profile);
        }
      } catch (err) {
        // Not logged in or expired cookie
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    setToken(data.accessToken);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setUser(data.user);
    setToken(data.accessToken);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
