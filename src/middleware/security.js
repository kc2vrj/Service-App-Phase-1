// src/middleware/security.js
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const withAuth = (handler) => {
  return async (req, res) => {
    console.group('🔒 Auth Middleware Check');
    
    try {
      // Log auth header (redacted for security)
      const authHeader = req.headers.authorization;
      console.log('Auth header present:', !!authHeader);
      if (!authHeader?.startsWith('Bearer ')) {
        console.error('❌ No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }

      const auth = getAuth();
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser?.email || 'none');

      if (!currentUser) {
        console.error('❌ No authenticated user');
        return res.status(401).json({ 
          error: 'Not authenticated',
          details: 'No current user found in Firebase Auth'
        });
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      console.log('User doc exists:', userDoc.exists());
      
      if (!userDoc.exists()) {
        console.error('❌ User document not found');
        return res.status(401).json({ error: 'User not found in database' });
      }

      const userData = userDoc.data();
      console.log('User data:', {
        role: userData?.role,
        email: userData?.email,
        uid: currentUser.uid
      });

      if (!userData?.role || !['ADMIN', 'SUPER_ADMIN'].includes(userData.role)) {
        console.error('❌ Insufficient privileges');
        return res.status(403).json({ 
          error: 'Insufficient privileges',
          details: `Required: ADMIN or SUPER_ADMIN, Found: ${userData?.role}`
        });
      }

      req.user = {
        uid: currentUser.uid,
        email: currentUser.email,
        role: userData.role
      };

      console.log('✅ Authentication successful', req.user);
      return handler(req, res);
    } catch (error) {
      console.error('❌ Auth middleware error:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      return res.status(401).json({ 
        error: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      console.groupEnd();
    }
  };
};