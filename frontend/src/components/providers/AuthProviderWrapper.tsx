'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/BetterAuthContext';
import { authClient } from '../../lib/better-auth-client'; // Import authClient

interface AuthProviderWrapperProps {
  children: ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  return (
    <authClient.Provider> {/* Add authClient.Provider here */}
      <AuthProvider>{children}</AuthProvider>
    </authClient.Provider>
  );
};

export default AuthProviderWrapper;