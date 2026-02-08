# Quickstart: Better Auth Integration

## Overview
This guide provides a quick overview of the Better Auth integration implementation, including setup instructions and key integration points.

## Prerequisites
- Node.js 18+ installed
- Next.js 14 project with App Router
- Existing backend API with JWT-based authentication
- TypeScript configuration (optional but recommended)

## Installation

### 1. Install Better Auth Dependencies
```bash
cd frontend
npm install better-auth @better-auth/react
```

### 2. Initialize Better Auth Client
Create the Better Auth client configuration in your application:

```typescript
// frontend/src/lib/better-auth-client.ts
import { createAuthClient } from "better-auth/client";
import { reactClient } from "@better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000/api/auth",
  plugins: [reactClient()],
});
```

### 3. Update Environment Variables
Add the following to your `.env.local` file:
```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
```

## Integration Steps

### 1. Replace AuthContext
Replace the existing custom AuthContext with Better Auth integration:

```typescript
// frontend/src/contexts/BetterAuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@better-auth/react';
import { authClient } from '../lib/better-auth-client';

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
  const { session, signIn, signUp, signOut } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!session);
  }, [session]);

  const login = async (email: string, password: string) => {
    await signIn.email({
      email,
      password,
      callbackURL: '/dashboard',
    });
  };

  const register = async (email: string, password: string, username: string) => {
    await signUp.email({
      email,
      password,
      callbackURL: '/dashboard',
    });
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    user: session?.user || null,
    token: session?.token || null,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Update API Client
Modify the API client to use Better Auth tokens:

```typescript
// frontend/src/lib/ApiClient.ts
import axios from 'axios';
import { authClient } from './better-auth-client';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
});

// Request interceptor to add Better Auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get current session to access token
    const session = await authClient.getSession();
    if (session) {
      config.headers.Authorization = `Bearer ${session.session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, try to refresh session
      // Better Auth handles this automatically in most cases
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Update Login Page
Convert the login page to use Better Auth:

```typescript
// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/BetterAuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 4. Update Register Page
Convert the register page to use Better Auth:

```typescript
// frontend/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/BetterAuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, username);
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Running the Application

### 1. Start the Development Server
```bash
cd frontend
npm run dev
```

### 2. Verify Integration
- Navigate to the login page and verify the form renders correctly
- Check that authentication functions work as expected
- Verify API calls include proper authentication headers
- Test session persistence across page navigation

## Troubleshooting

### Common Issues
- **Token not included in API requests**: Ensure the API client interceptor is properly configured
- **Session not persisting**: Check that Better Auth client is properly initialized
- **Redirects not working**: Verify callback URLs are correctly configured

### Environment Configuration
Make sure your environment variables are correctly set for both development and production environments.