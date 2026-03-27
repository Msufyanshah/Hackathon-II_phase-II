import { useEffect } from 'react';

// Vercel Analytics and performance monitoring configuration

// Analytics event types
export enum AnalyticsEvent {
  PAGE_VIEW = 'page_view',
  USER_LOGIN = 'user_login',
  USER_REGISTER = 'user_register',
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_DELETED = 'task_deleted',
  FORM_SUBMIT = 'form_submit',
  BUTTON_CLICK = 'button_click',
  ERROR_OCCURRED = 'error_occurred',
  API_CALL = 'api_call'
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

// Analytics configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackUserInteractions: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  userId?: string;
}

// Default analytics configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
  trackPageViews: true,
  trackUserInteractions: true,
  trackPerformance: true,
  trackErrors: true
};

// Analytics service class
class AnalyticsService {
  private config: AnalyticsConfig;
  private initialized: boolean = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  initialize(userId?: string) {
    if (this.initialized) return;

    this.config.userId = userId;
    this.initialized = true;

    // Set up error tracking
    if (this.config.trackErrors) {
      this.setupErrorTracking();
    }

    // Track initial page view if enabled
    if (this.config.trackPageViews) {
      this.trackPageView(window.location.pathname);
    }

    if (this.config.debug) {
      console.log('Analytics service initialized', this.config);
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.config.enabled || !this.config.trackPageViews) return;

    this.sendEvent(AnalyticsEvent.PAGE_VIEW, {
      path,
      title: title || document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent, properties: Record<string, any> = {}) {
    if (!this.config.enabled) return;

    this.sendEvent(event, {
      ...properties,
      userId: this.config.userId,
      timestamp: new Date().toISOString()
    });
  }

  // Track button clicks
  trackButtonClick(buttonId: string, component?: string) {
    if (!this.config.enabled || !this.config.trackUserInteractions) return;

    this.trackEvent(AnalyticsEvent.BUTTON_CLICK, {
      buttonId,
      component,
      page: window.location.pathname
    });
  }

  // Track key user interactions for analytics
  trackKeyInteraction(interactionType: string, properties: Record<string, any> = {}) {
    if (!this.config.enabled || !this.config.trackUserInteractions) return;

    this.trackEvent(AnalyticsEvent.BUTTON_CLICK, {
      interactionType,
      ...properties,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }

  // Track user journey events
  trackUserJourney(step: string, properties: Record<string, any> = {}) {
    if (!this.config.enabled) return;

    this.trackEvent(AnalyticsEvent.USER_LOGIN as AnalyticsEvent, { // Using generic event type
      step,
      ...properties,
      userId: this.config.userId,
      page: window.location.pathname
    });
  }

  // Track form interactions
  trackFormInteraction(formId: string, action: 'focus' | 'change' | 'blur', fieldName?: string) {
    if (!this.config.enabled || !this.config.trackUserInteractions) return;

    this.trackEvent('form_interaction' as AnalyticsEvent, {
      formId,
      action,
      fieldName,
      page: window.location.pathname
    });
  }

  // Track navigation events
  trackNavigation(from: string, to: string, trigger?: string) {
    if (!this.config.enabled || !this.config.trackUserInteractions) return;

    this.trackEvent('navigation' as AnalyticsEvent, {
      from,
      to,
      trigger,
      userId: this.config.userId
    });
  }

  // Track form submissions
  trackFormSubmit(formId: string, success: boolean, errors?: string[]) {
    if (!this.config.enabled || !this.config.trackUserInteractions) return;

    this.trackEvent(AnalyticsEvent.FORM_SUBMIT, {
      formId,
      success,
      errors,
      page: window.location.pathname
    });
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, status: number, duration: number) {
    if (!this.config.enabled) return;

    this.trackEvent(AnalyticsEvent.API_CALL, {
      endpoint,
      method,
      status,
      duration,
      page: window.location.pathname
    });
  }

  // Track performance metrics
  trackPerformance(metric: PerformanceMetric) {
    if (!this.config.enabled || !this.config.trackPerformance) return;

    this.trackEvent('performance_metric' as AnalyticsEvent, metric);
  }

  // Send event to analytics endpoint
  private sendEvent(event: AnalyticsEvent, data: Record<string, any>) {
    if (this.config.debug) {
      console.log(`Analytics Event: ${event}`, data);
    }

    // In a real implementation, this would send data to an analytics service
    // For now, we'll just log to the console in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Send to Vercel Analytics or other service
    try {
      // Example: Send to Vercel Analytics
      if (typeof window !== 'undefined' && (window as any).va) {
        (window as any).va('event', { name: event, data });
      } else {
        // Fallback: send to custom endpoint
        navigator.sendBeacon('/api/analytics', JSON.stringify({ event, data }));
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Set up error tracking
  private setupErrorTracking() {
    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.trackEvent(AnalyticsEvent.ERROR_OCCURRED, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
        page: window.location.pathname
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent(AnalyticsEvent.ERROR_OCCURRED, {
        type: 'unhandled_promise_rejection',
        reason: event.reason?.toString(),
        page: window.location.pathname
      });
    });
  }

  // Update user ID
  setUserId(userId: string) {
    this.config.userId = userId;
  }

  // Get current configuration
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;

// Hook for React components
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics when component mounts
    analyticsService.initialize();
  }, []);

  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackButtonClick: analyticsService.trackButtonClick.bind(analyticsService),
    trackFormSubmit: analyticsService.trackFormSubmit.bind(analyticsService),
    trackApiCall: analyticsService.trackApiCall.bind(analyticsService),
    setUserId: analyticsService.setUserId.bind(analyticsService)
  };
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.setupPerformanceMonitoring();
  }

  setupPerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    // Observe long tasks
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        analyticsService.trackPerformance({
          name: 'long_task',
          value: entry.duration,
          rating: entry.duration > 50 ? 'poor' : entry.duration > 25 ? 'needs-improvement' : 'good',
          id: entry.name
        });
      });
    });

    try {
      this.observer.observe({ entryTypes: ['longtask', 'navigation', 'paint'] });
    } catch (error) {
      console.error('Failed to setup performance monitoring:', error);
    }
  }

  // Measure specific operations
  measureOperation(operation: string, fn: () => any) {
    const startMark = `start-${operation}`;
    const endMark = `end-${operation}`;

    performance.mark(startMark);

    try {
      const result = fn();
      performance.mark(endMark);

      performance.measure(operation, startMark, endMark);
      const measure = performance.getEntriesByName(operation)[0];

      analyticsService.trackPerformance({
        name: operation,
        value: measure.duration,
        rating: measure.duration > 100 ? 'poor' : measure.duration > 50 ? 'needs-improvement' : 'good'
      });

      return result;
    } finally {
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(operation);
    }
  }

  // Get performance metrics
  getMetrics() {
    return {
      navigation: performance.getEntriesByType('navigation'),
      paint: performance.getEntriesByType('paint'),
      resources: performance.getEntriesByType('resource')
    };
  }
}

// Create a performance monitor instance
export const performanceMonitor = new PerformanceMonitor();