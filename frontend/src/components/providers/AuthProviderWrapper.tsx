'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/BetterAuthContext';

interface AuthProviderWrapperProps {
  children: ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
