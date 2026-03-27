'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateToken } from '../lib/auth-token-manager';

interface User {
  id: string;
  email: string;
  username: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      updateToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Sync token with API client
  useEffect(() => {
    updateToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call backend login endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed with status ${response.status}`);
      }

      const data = await response.json();

      // Store token, refresh token and user data
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('jwt_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      updateToken(data.access_token);

      console.log("Login successful - User ID:", data.user.id);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Call backend registration endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Registration failed with status ${response.status}`);
      }

      const data = await response.json();

      // Store token, refresh token and user data
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('jwt_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      updateToken(data.access_token);

      console.log("Registration successful - User ID:", data.user.id);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear local state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    updateToken(null);
  };

  const refreshToken = async (): Promise<string | null> => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      console.warn('No refresh token available');
      return null;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) {
        console.warn('Token refresh failed, clearing session');
        logout();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access_token;

      // Update token in state and localStorage
      setToken(newAccessToken);
      localStorage.setItem('jwt_token', newAccessToken);
      updateToken(newAccessToken);

      console.log('Token refreshed successfully');
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return null;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};