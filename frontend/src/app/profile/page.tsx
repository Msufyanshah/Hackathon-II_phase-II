'use client';

import React from 'react';
import { useAuth } from '../../contexts/BetterAuthContext';
import Layout from '../../components/ui/Layout';
import UserProfile from '../../components/ui/UserProfile';
import { redirect } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <Layout title="Profile">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <UserProfile userId={user?.id} showActions={true} />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;