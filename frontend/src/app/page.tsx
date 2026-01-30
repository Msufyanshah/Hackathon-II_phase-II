'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Link from 'next/link';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to the Todo Application
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your tasks efficiently with our secure and intuitive platform.
            Sign in to access your personalized task management dashboard.
          </p>

          <Card className="p-8 mb-8 bg-white shadow-lg rounded-xl">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="primary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="secondary" size="lg">
                      Create Account
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Organize</h3>
              <p className="text-gray-600">Keep track of all your tasks in one place</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">Share and manage tasks with your team</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Achieve</h3>
              <p className="text-gray-600">Complete tasks and reach your goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;