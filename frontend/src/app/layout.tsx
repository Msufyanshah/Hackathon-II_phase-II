import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AuthProviderWrapper from '@/components/providers/AuthProviderWrapper'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow — Premium Task Management',
  description: 'Organize your work, amplify your life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bg-primary text-text-primary antialiased`}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            },
            success: { style: { borderColor: 'var(--accent-emerald)' } },
            error: { style: { borderColor: 'var(--accent-rose)' } },
          }}
        />
      </body>
    </html>
  )
}
