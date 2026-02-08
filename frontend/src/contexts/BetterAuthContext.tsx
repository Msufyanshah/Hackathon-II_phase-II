'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/better-auth-client';
import { authTokenManager } from '../lib/auth-token-manager';
import { useStore } from 'better-auth/react';


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
  // Use Better Auth's session hook from the client instance
  // const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const { data: session, isLoading: isAuthLoading } =
  useStore(authClient.$store);


  const [apiToken, setApiToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Combine loading states
  useEffect(() => {
    // Better Auth session loading state combined with our local loading state
    setIsLoading(isAuthLoading);
  }, [isAuthLoading]);

  // Update the API client token when it changes
  useEffect(() => {
    authTokenManager.updateToken(apiToken);
  }, [apiToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Sign in with Better Auth for frontend session management
      await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      // 2. If Better Auth login is successful, get the API token from our backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If the backend login fails, we should probably sign out of Better Auth
        // to keep states in sync.
        await authClient.signOut();
        throw new Error(errorData.detail || `Backend login failed: ${response.statusText}`);
      }

      const data = await response.json();
      const { access_token } = data.data;

      // 3. Store the JWT for API calls
      setApiToken(access_token);

    } catch (error) {
      console.error('Login error:', error);
      // Ensure we're signed out of Better Auth if any part of the flow fails
      await authClient.signOut().catch(e => console.error("Failed to sign out during error handling", e));
      setApiToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // 1. Sign up with Better Auth for frontend session management
      await authClient.signUp.email({
        email,
        password,
        name: username,
        callbackURL: '/dashboard',
      });

      // 2. If Better Auth sign-up is successful, register with our backend to get an API token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If backend registration fails, sign out of Better Auth
        await authClient.signOut();
        throw new Error(errorData.detail || `Backend registration failed: ${response.statusText}`);
      }

      const data = await response.json();
      const { access_token } = data.data;

      // 3. Store the JWT for API calls
      setApiToken(access_token);

    } catch (error) {
      console.error('Registration error:', error);
      // Ensure we're signed out of Better Auth if any part of the flow fails
      await authClient.signOut().catch(e => console.error("Failed to sign out during error handling", e));
      setApiToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Clear API token
      setApiToken(null);

      // Also sign out of Better Auth
      try {
        await authClient.signOut();
      } catch (betterAuthError) {
        console.warn('Better Auth sign out failed:', betterAuthError);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user: (session?.user && Object.keys(session.user).length > 0) ? session.user : null,
    token: apiToken, // Only for API calls, not auth state
    isLoading,
    isAuthenticated: !!session, // ✅ RULE 1: auth state from Better Auth session
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};