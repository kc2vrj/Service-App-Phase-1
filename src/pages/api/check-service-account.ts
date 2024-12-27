// src/pages/api/check-service-account.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { GoogleWorkspaceAuth } from '@/lib/google/auth';

// Initialize Firebase Admin
const app = !getApps().length ? initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  }),
}) : getApps()[0];

const adminAuth = getAuth(app);

// Validate required environment variables
const validateEnvVars = () => {
  const required = [
    'GOOGLE_WORKLOAD_IDENTITY_PROVIDER',
    'GOOGLE_SERVICE_ACCOUNT',
    'GOOGLE_WORKSPACE_DOMAIN'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.group('🔍 Check Service Account Status');
  
  if (req.method !== 'GET') {
    console.warn('❌ Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate environment variables first
    try {
      validateEnvVars();
    } catch (err) {
      console.error('❌ Environment validation failed:', err);
      return res.status(500).json({ 
        error: 'Service account not properly configured',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('🔍 Verifying token...');

    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('✅ Token verified for:', decodedToken.email);

    // Initialize Google Workspace auth
    const googleAuth = new GoogleWorkspaceAuth();

    try {
      // Try to get the service account client using workload identity
      const admin = await googleAuth.getAdminDirectory('serviceAccount');
      
      // Test the credentials by listing users
      const response = await admin.users.list({
        customer: 'my_customer',
        maxResults: 1,
        domain: process.env.GOOGLE_WORKSPACE_DOMAIN
      });

      console.log('✅ Service account check successful');
      res.status(200).json({
        email: process.env.GOOGLE_SERVICE_ACCOUNT,
        connected: true,
        domain: process.env.GOOGLE_WORKSPACE_DOMAIN
      });
    } catch (err) {
      console.error('❌ Service account authentication failed:', err);
      return res.status(500).json({ 
        error: 'Service account authentication failed',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Could not authenticate with Google Workspace'
      });
    }
  } catch (error) {
    console.error('❌ Error checking service account:', error);
    res.status(500).json({ 
      error: 'Failed to check service account',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    console.groupEnd();
  }
}
