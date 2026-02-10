'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/better-auth-client';
import { updateToken } from '../lib/auth-token-manager';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync loading state
  useEffect(() => {
    setIsLoading(isAuthLoading);
  }, [isAuthLoading]);

  // Sync token with your manager (for other API calls)
  useEffect(() => {
    updateToken(apiToken);
  }, [apiToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email({ email, password, dontRedirect: true });

      // Updated URL to match your Swagger /api/auth prefix
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        await authClient.signOut();
        throw new Error(errorData.detail || `Backend login failed`);
      }

      const data = await response.json();
      // FIX: Swagger showed access_token is at data.access_token, not data.data.access_token
      setApiToken(data.access_token); 
    } catch (error) {
      console.error('Login error:', error);
      await authClient.signOut().catch(() => {});
      setApiToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // 1. Better Auth Sign up
      await authClient.signUp.email({ 
        email, 
        password, 
        name: username, 
        callbackURL: '/dashboard' 
      });

      // 2. Python Backend Sign up
      // URL matching your Swagger: http://localhost:8000/api/auth/register
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, username }),
});

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If backend fails, we sign out of Better Auth to keep things in sync
        await authClient.signOut();
        throw new Error(errorData.detail?.[0]?.msg || errorData.detail || `Backend registration failed`);
      }

      const data = await response.json();
      // FIX: Match your backend's response structure
      setApiToken(data.access_token);
    } catch (error) {
      console.error('Registration error:', error);
      await authClient.signOut().catch(() => {});
      setApiToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setApiToken(null);
      await authClient.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user: session?.user ?? null,
    token: apiToken,
    isLoading,
    isAuthenticated: !!session,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};