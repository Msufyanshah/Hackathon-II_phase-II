'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/forms/LoginForm';
import Layout from '../../components/ui/Layout';
import { redirect } from 'next/navigation';

const LoginPage: React.FC = () => {
  const { state } = useAuth();

  // If already authenticated, redirect to dashboard
  if (state.isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <Layout title="Login">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>

          <LoginForm
            onSuccess={() => {
              // The LoginForm handles the redirect internally
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