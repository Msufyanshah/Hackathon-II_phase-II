'use client';

import React from 'react';
import { useAuth } from '../../contexts/BetterAuthContext';
import RegisterForm from '../../components/forms/RegisterForm';
import Layout from '../../components/ui/Layout';
import { redirect } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <Layout title="Register">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>

          <RegisterForm
            onSuccess={() => {
              // The RegisterForm handles the redirect internally
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