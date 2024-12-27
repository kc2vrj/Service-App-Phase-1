/**
 * sync-workspace-users.ts
 * API endpoint for synchronizing users between Google Workspace and the application.
 * 
 * This endpoint:
 * 1. Authenticates the request using Firebase Admin
 * 2. Verifies user has admin privileges
 * 3. Fetches users from Google Workspace
 * 4. Syncs user data with Firestore database
 * 
 * @endpoint POST /api/sync-workspace-users
 * @requires Authorization Bearer token
 * @returns {Object} Sync statistics including added, updated, and error counts
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { GoogleWorkspaceAuth } from '@/lib/google/auth';

// Initialize Firebase Admin if not already initialized
const app = !getApps().length ? initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  }),
}) : getApps()[0];

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

/**
 * API handler for synchronizing Google Workspace users
 * @param {NextApiRequest} req - Next.js API request object
 * @param {NextApiResponse} res - Next.js API response object
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.group('🔄 Workspace Sync Endpoint');
  
  // Verify HTTP method
  if (req.method !== 'POST') {
    console.warn('❌ Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('🔍 Verifying token...');

    // Verify the Firebase token and user privileges
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('✅ Token verified for:', decodedToken.email);

    // Get user data and verify admin privileges
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      console.error('❌ User document not found');
      return res.status(401).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    if (!userData?.role || !['ADMIN', 'SUPER_ADMIN'].includes(userData.role)) {
      console.error('❌ Insufficient privileges:', userData?.role);
      return res.status(403).json({ error: 'Insufficient privileges' });
    }

    // Initialize Google Workspace API client
    const googleAuth = new GoogleWorkspaceAuth();
    const admin = await googleAuth.getAdminDirectory('serviceAccount');
    console.log('📥 Fetching users from Google Workspace...');

    // Fetch all users from Google Workspace
    const workspaceUsers = await admin.users.list({
      customer: 'my_customer',
      orderBy: 'email',
      projection: 'full'
    });

    // Initialize sync statistics
    const stats = {
      added: 0,
      updated: 0,
      removed: 0,
      errors: 0,
      skipped: 0
    };

    // Process each user from Google Workspace
    for (const user of workspaceUsers.data.users || []) {
      try {
        // Skip processing suspended users
        if (user.suspended) {
          stats.skipped++;
          continue;
        }

        // Skip users without primary email
        if (!user.primaryEmail) {
          stats.skipped++;
          continue;
        }

        // Check if user exists in Firestore
        const userRef = adminDb.collection('users').where('email', '==', user.primaryEmail);
        const snapshot = await userRef.get();

        if (snapshot.empty) {
          // Create new user record
          const newUserData = {
            email: user.primaryEmail,
            firstName: user.name?.givenName || '',
            lastName: user.name?.familyName || '',
            role: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            synced: true,
            workspaceId: user.id,
            orgUnitPath: user.orgUnitPath,
            lastLoginTime: user.lastLoginTime,
            isAdmin: user.isAdmin || false,
            thumbnailPhotoUrl: user.thumbnailPhotoUrl || null
          };

          await adminDb.collection('users').add(newUserData);
          stats.added++;
          console.log('➕ Added user:', user.primaryEmail);
        } else {
          // Update existing user record
          const docId = snapshot.docs[0].id;
          const updateData = {
            firstName: user.name?.givenName || '',
            lastName: user.name?.familyName || '',
            updatedAt: new Date().toISOString(),
            synced: true,
            workspaceId: user.id,
            orgUnitPath: user.orgUnitPath,
            lastLoginTime: user.lastLoginTime,
            isAdmin: user.isAdmin || false,
            thumbnailPhotoUrl: user.thumbnailPhotoUrl || null
          };

          await adminDb.collection('users').doc(docId).update(updateData);
          stats.updated++;
          console.log('🔄 Updated user:', user.primaryEmail);
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.primaryEmail}:`, error);
        stats.errors++;
      }
    }

    console.log('✅ Sync completed with stats:', stats);
    res.status(200).json({
      success: true,
      details: stats
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Sync failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    console.groupEnd();
  }
}

export default handler;