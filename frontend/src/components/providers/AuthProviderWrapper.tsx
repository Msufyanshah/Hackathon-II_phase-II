'use client';

'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';

interface AuthProviderWrapperProps {
  children: ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;