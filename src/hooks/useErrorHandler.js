// hooks/useErrorHandler.js
import { useCallback } from 'react';
import { errorLogger } from '../services/errorLogging';

export const useErrorHandler = (componentName) => {
  const handleError = useCallback(async (error, context = {}) => {
    await errorLogger.logError(error, {
      ...context,
      componentName,
      type: 'HANDLED_ERROR',
    });
  }, [componentName]);

  const handleWarning = useCallback(async (message, context = {}) => {
    await errorLogger.logWarning(message, {
      ...context,
      componentName,
      type: 'HANDLED_WARNING',
    });
  }, [componentName]);

  return {
    handleError,
    handleWarning,
  };
};