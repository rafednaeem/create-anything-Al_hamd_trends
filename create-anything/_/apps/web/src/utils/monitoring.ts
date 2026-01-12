import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Sentry Configuration for Error Tracking
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
      ],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Filter out sensitive information
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.stacktrace) {
            // Remove potential sensitive data from stack traces
            error.stacktrace.frames = error.stacktrace.frames?.map(frame => ({
              ...frame,
              vars: undefined // Remove local variables
            }));
          }
        }
        return event;
      },
    });
  }
};

// Performance Monitoring
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Analytics Configuration
export const initAnalytics = () => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    // Google Analytics
    if (typeof window !== 'undefined' && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: window.location.pathname,
        send_page_view: true,
      });
    }
  }
};

// Custom Error Reporting
export const reportError = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error);
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: { custom: context },
    });
  }
};

// Performance Tracking
export const trackPerformance = (name: string, duration: number, metadata?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message: `Performance: ${name}`,
      level: 'info',
      data: { duration, ...metadata },
    });
  }
};

// User Tracking
export const trackUser = (userId: string, traits?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({ id: userId, ...traits });
    
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        user_id: userId,
      });
    }
  }
};

// Event Tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message: `Event: ${eventName}`,
      level: 'info',
      data: properties,
    });
    
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }
};
