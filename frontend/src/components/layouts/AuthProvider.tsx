import React from 'react';
import { AuthProvider as AuthProviderComponent } from '../../contexts/AuthContext';

// This is a wrapper component for the AuthContext Provider
// It's already implemented in the contexts/AuthContext.tsx file
// This component exists to match the task requirements and provide a consistent interface

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProviderComponent>
      {children}
    </AuthProviderComponent>
  );
};

export default AuthProvider;