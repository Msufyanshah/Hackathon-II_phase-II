'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/forms/LoginForm';
import Layout from '../../components/ui/Layout';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const { state } = useAuth();
  const router = useRouter();

  // Mock router if not in Next.js context
  const mockRouter = {
    push: (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  };

  const effectiveRouter = router || mockRouter;

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (state.isAuthenticated) {
      effectiveRouter.push('/dashboard');
    }
  }, [state.isAuthenticated]);

  if (state.isAuthenticated) {
    return null; // Or redirect in a real Next.js app
  }

  return (
    <Layout title="Login">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>

          <LoginForm
            onSuccess={() => {
              // In a real app, this would be handled by the router in LoginForm
              effectiveRouter.push('/dashboard');
            }}
            onError={(error) => {
              console.error('Login error:', error);
            }}
            redirectAfterLogin="/dashboard"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;