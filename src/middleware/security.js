// middleware/security.js
import { getAuth } from 'firebase-admin/auth';
import { db } from '../lib/firebase';

// Rate limiting implementation using Firestore
export const createRateLimiter = (windowMs = 900000, maxAttempts = 5) => {
  return async (userIp) => {
    const attemptsRef = db.collection('loginAttempts').doc(userIp);
    
    try {
      const doc = await attemptsRef.get();
      const now = Date.now();
      
      if (!doc.exists) {
        await attemptsRef.set({
          attempts: 1,
          windowStart: now
        });
        return true;
      }

      const data = doc.data();
      if (now - data.windowStart > windowMs) {
        // Reset window
        await attemptsRef.set({
          attempts: 1,
          windowStart: now
        });
        return true;
      }

      if (data.attempts >= maxAttempts) {
        return false;
      }

      await attemptsRef.update({
        attempts: data.attempts + 1
      });
      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Fail open to prevent blocking legitimate users
    }
  };
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim()
      .replace(/[<>]/g, '') // Basic XSS protection
      .slice(0, 1000); // Limit string length
  }
  if (typeof input === 'object' && input !== null) {
    return Object.entries(input).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: sanitizeInput(value),
    }), {});
  }
  return input;
};

// Auth middleware for API routes
export const withAuth = (handler) => {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(token);
      
      req.user = decodedToken;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

// Validation helper
export const validateRequest = (schema) => {
  return (data) => {
    try {
      const errors = {};
      
      Object.entries(schema).forEach(([field, rules]) => {
        const value = data[field];
        
        if (rules.required && !value) {
          errors[field] = 'This field is required';
        }
        
        if (rules.maxLength && value?.length > rules.maxLength) {
          errors[field] = `Maximum length is ${rules.maxLength} characters`;
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = rules.message || 'Invalid format';
        }
      });

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        errors: { _global: 'Validation failed' }
      };
    }
  };
};

// Example validation schema
export const timesheetSchema = {
  date: { required: true },
  customerName: { required: true, maxLength: 100 },
  workOrder: { maxLength: 50 },
  notes: { maxLength: 1000 }
};