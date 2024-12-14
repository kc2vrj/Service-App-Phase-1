// services/errorLogging.js
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

class ErrorLogger {
  constructor() {
    this.errorCollection = 'error_logs';
    this.enabled = process.env.NEXT_PUBLIC_ERROR_LOGGING_ENABLED === 'true';
    this.environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  }

  async logError(error, context = {}) {
    if (!this.enabled) return;

    try {
      const errorLog = {
        timestamp: serverTimestamp(),
        environment: this.environment,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code,
        },
        context: {
          ...context,
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        },
        metadata: {
          version: process.env.NEXT_PUBLIC_APP_VERSION,
          node_env: process.env.NODE_ENV,
        }
      };

      await addDoc(collection(db, this.errorCollection), errorLog);

      // If in development, also console log the error
      if (this.environment === 'development') {
        console.error('Logged Error:', error);
        console.debug('Error Context:', context);
      }
    } catch (loggingError) {
      // Fallback logging if Firebase fails
      console.error('Error logging failed:', loggingError);
      console.error('Original error:', error);
    }
  }

  async logWarning(message, context = {}) {
    if (!this.enabled) return;

    try {
      const warningLog = {
        timestamp: serverTimestamp(),
        environment: this.environment,
        level: 'WARNING',
        message,
        context: {
          ...context,
          url: typeof window !== 'undefined' ? window.location.href : '',
        },
        metadata: {
          version: process.env.NEXT_PUBLIC_APP_VERSION,
          node_env: process.env.NODE_ENV,
        }
      };

      await addDoc(collection(db, this.errorCollection), warningLog);
    } catch (loggingError) {
      console.warn('Warning logging failed:', loggingError);
      console.warn('Original warning:', message);
    }
  }

  createErrorBoundaryLogger(componentName) {
    return async (error, errorInfo) => {
      await this.logError(error, {
        type: 'REACT_ERROR_BOUNDARY',
        componentName,
        componentStack: errorInfo?.componentStack,
      });
    };
  }
}

export const errorLogger = new ErrorLogger();