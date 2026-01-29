// Component-level testing setup for the application

// Mock global objects and APIs that may not be available in test environment
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Intersection Observer (commonly used for infinite scroll, lazy loading)
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia (used for responsive design testing)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage and sessionStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage,
});

// Mock fetch API
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    pathname: '',
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

// Setup testing library utilities
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Custom matchers for common assertions
expect.extend({
  toHaveTextContentIgnoringWhitespace(received: HTMLElement, expected: string) {
    const normalizedReceived = received.textContent?.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expected.replace(/\s+/g, ' ').trim();

    const pass = normalizedReceived === normalizedExpected;

    return {
      pass,
      message: () =>
        `expected element to ${pass ? 'not ' : ''}have text content "${normalizedExpected}", but got "${normalizedReceived}"`,
    };
  },
});

// Types for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContentIgnoringWhitespace(expected: string): R;
    }
  }
}