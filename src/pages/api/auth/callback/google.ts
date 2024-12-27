// src/pages/api/auth/callback/google.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleWorkspaceAuth } from '@/lib/google/auth';
import { getCookie } from 'cookies-next';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state, error } = req.query;

  // Check for OAuth errors
  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`/admin/workspace?error=${error}`);
  }

  // Verify state parameter
  const storedState = getCookie('oauth_state', { req, res });
  if (!storedState || storedState !== state) {
    return res.redirect('/admin/workspace?error=invalid_state');
  }

  try {
    const auth = new GoogleWorkspaceAuth();
    const tokenData = await auth.handleCallback(code as string);

    // Store tokens in Firestore
    if (req.user?.uid) {
      await setDoc(doc(db, 'workspace_tokens', req.user.uid), {
        ...tokenData,
        updatedAt: new Date(),
      });
    }

    // Clear OAuth cookies
    res.setHeader('Set-Cookie', [
      'oauth_state=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0',
      'device_id=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0'
    ]);

    res.redirect('/admin/workspace?status=success');
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.redirect(`/admin/workspace?error=callback_failed&message=${encodeURIComponent(errorMessage)}`);
  }
}
