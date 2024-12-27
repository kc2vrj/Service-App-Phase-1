// src/pages/api/auth/google/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleWorkspaceAuth } from '@/lib/google/auth';
import { auth } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('/admin/workspace?error=oauth_denied');
    }

    // Validate state to prevent CSRF
    const storedState = req.cookies.oauth_state;
    if (!state || !storedState || state !== storedState) {
      return res.redirect('/admin/workspace?error=invalid_state');
    }

    // Clear the state cookie
    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    // Get user ID from Firebase auth token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.redirect('/admin/workspace?error=unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Initialize Google Workspace auth
    const googleAuth = new GoogleWorkspaceAuth();

    // Exchange code for tokens
    const tokenData = await googleAuth.handleCallback(code as string);
    tokenData.userId = userId;

    // Store encrypted tokens
    await googleAuth.storeTokens(userId, tokenData);

    // Test the connection using service account
    const adminDirectory = await googleAuth.getAdminDirectory('serviceAccount');
    await adminDirectory.users.list({
      customer: 'my_customer',
      maxResults: 1
    });

    res.redirect('/admin/workspace?status=success');
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.redirect(`/admin/workspace?error=callback_failed&message=${encodeURIComponent(errorMessage)}`);
  }
}