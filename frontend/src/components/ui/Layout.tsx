import React from 'react';
import Head from 'next/head';
import { BaseComponentProps } from '../../lib/types';
import Header from './Header';
import Footer from './Footer';

export interface LayoutProps extends BaseComponentProps {
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Todo App',
  showHeader = true,
  showFooter = true,
  headerProps,
  footerProps,
  className = '',
  ...props
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`} {...props}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showHeader && <Header {...headerProps} />}

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

export default Layout;