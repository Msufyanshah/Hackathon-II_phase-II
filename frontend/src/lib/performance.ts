// Performance utilities for optimizing bundle size and improving metrics

// Lazy loading utility for components
export const lazyLoad = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const LazyComponent = React.lazy(factory);
  return LazyComponent;
};

// Memoized components to prevent unnecessary re-renders
export const memoizeComponent = <T extends React.ComponentType<any>>(
  Component: T,
  propsAreEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

// Debounce function to optimize expensive operations
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Throttle function to limit function calls
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle: boolean;

  return function (...args: Parameters<F>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, height?: number, quality: number = 75) => {
  // In a real Next.js app, we'd use the next/image component
  // For now, return the original src with optional query params
  let optimizedSrc = src;

  if (width) {
    optimizedSrc += `?w=${width}`;
  }
  if (height) {
    optimizedSrc += width ? `&h=${height}` : `?h=${height}`;
  }
  if (quality && quality !== 75) {
    optimizedSrc += width || height ? `&q=${quality}` : `?q=${quality}`;
  }

  return optimizedSrc;
};

// Bundle size optimization - dynamic imports
export const loadModule = async <T,>(importPath: () => Promise<T>): Promise<T> => {
  return import(importPath);
};

// Memory management utilities
export class CacheManager {
  private cache: Map<string, any>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first in the map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Virtual scrolling utility (simplified version)
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  totalCount: number;
}

export const calculateVisibleRange = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
): { start: number; end: number } => {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(start + visibleCount + overscan, Math.floor(containerHeight / itemHeight));

  return {
    start: Math.max(0, start - overscan),
    end: Math.min(Math.floor(containerHeight / itemHeight), end)
  };
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private marks: Map<string, number>;
  private measures: Map<string, number>;

  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }

  mark(name: string) {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark: string) {
    if (this.marks.has(startMark) && this.marks.has(endMark)) {
      const duration = this.marks.get(endMark)! - this.marks.get(startMark)!;
      this.measures.set(name, duration);
      return duration;
    }
    return null;
  }

  getMeasure(name: string) {
    return this.measures.get(name);
  }

  getAllMeasures() {
    return Object.fromEntries(this.measures);
  }

  clear() {
    this.marks.clear();
    this.measures.clear();
  }
}

// Bundle analyzer utility (placeholder for actual implementation)
export const analyzeBundle = () => {
  console.log('Bundle analysis would run here in a real implementation');
  // In a real app, this would integrate with webpack-bundle-analyzer or similar
};

// Code splitting utility functions
export const preloadModule = async (modulePath: () => Promise<any>) => {
  try {
    await modulePath();
    console.log('Module preloaded successfully');
  } catch (error) {
    console.error('Failed to preload module:', error);
  }
};

// Export React for the lazyLoad function
import React from 'react';

export default {
  lazyLoad,
  memoizeComponent,
  debounce,
  throttle,
  optimizeImage,
  loadModule,
  CacheManager,
  calculateVisibleRange,
  PerformanceMonitor,
  analyzeBundle,
  preloadModule
};