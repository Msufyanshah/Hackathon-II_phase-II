'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/forms/RegisterForm';
import Layout from '../../components/ui/Layout';
import { useRouter } from 'next/router';

const RegisterPage: React.FC = () => {
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
    <Layout title="Register">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>

          <RegisterForm
            onSuccess={() => {
              // In a real app, this would be handled by the router in RegisterForm
              effectiveRouter.push('/dashboard');
            }}
            onError={(error) => {
              console.error('Registration error:', error);
            }}
            redirectAfterRegister="/dashboard"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;