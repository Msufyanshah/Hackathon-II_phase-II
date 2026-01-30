import React from 'react';
import '../styles/globals.css';
import AuthProviderWrapper from '../components/providers/AuthProviderWrapper';

export const metadata = {
  title: 'Todo Application',
  description: 'A secure and intuitive task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
