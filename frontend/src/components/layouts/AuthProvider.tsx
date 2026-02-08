'use client';

import React, { ReactNode } from 'react';
import { AuthProvider as AuthProviderComponent } from '../../contexts/BetterAuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
};

export default AuthProvider;