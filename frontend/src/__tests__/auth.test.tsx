/**
 * Authentication Service Tests
 * Tests for frontend authentication functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/BetterAuthContext';

// Mock fetch API
global.fetch = vi.fn();

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
};

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Functionality', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock successful login response
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'mock-jwt-token',
              token_type: 'bearer',
              user: {
                id: 'test-user-id',
                email: 'test@example.com',
                username: 'testuser',
              },
            }),
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('mock-jwt-token');
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should fail login with invalid credentials', async () => {
      // Mock failed login response
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              detail: 'Incorrect email or password',
            }),
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.login('wrong@example.com', 'wrongpassword');
        })
      ).rejects.toThrow();

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Registration Functionality', () => {
    it('should register successfully with valid data', async () => {
      // Mock successful registration response
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'mock-jwt-token',
              token_type: 'bearer',
              user: {
                id: 'test-user-id',
                email: 'newuser@example.com',
                username: 'newuser',
              },
            }),
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.register('newuser@example.com', 'password123', 'newuser');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should fail registration with duplicate email', async () => {
      // Mock duplicate email error
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              detail: 'User with this email already exists',
            }),
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.register('existing@example.com', 'password123', 'existinguser');
        })
      ).rejects.toThrow();
    });
  });

  describe('Logout Functionality', () => {
    it('should clear authentication state on logout', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // First login
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'mock-jwt-token',
              user: { id: 'test-user-id', email: 'test@example.com' },
            }),
        })
      );

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Then logout
      (fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
        })
      );

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });
  });
});
