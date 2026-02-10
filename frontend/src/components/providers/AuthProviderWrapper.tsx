'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/BetterAuthContext';
// authClient is not needed here if we aren't using a Provider
import { authClient } from '../../lib/better-auth-client'; 

interface AuthProviderWrapperProps {
  children: ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  return (
    // ✅ Simply render the AuthProvider (your custom context) and the children
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderWrapper;