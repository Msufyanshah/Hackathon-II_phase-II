import React from 'react';
import { BaseComponentProps } from '../../lib/types';

export interface FooterProps extends BaseComponentProps {
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  copyrightText = '© 2026 Todo App. All rights reserved.',
  className = '',
  children,
  ...props
}) => {
  return (
    <footer className={`bg-gray-100 border-t ${className}`} {...props}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">{copyrightText}</p>

          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </nav>
        </div>

        {children}
      </div>
    </footer>
  );
};

export default Footer;