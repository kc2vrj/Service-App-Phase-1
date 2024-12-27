// src/pages/api/auth/google/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleWorkspaceAuth } from '@/lib/google/auth';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = new GoogleWorkspaceAuth();

    // Generate state token for security
    const state = Math.random().toString(36).substring(7);
    
    // Generate a unique device ID
    const deviceId = randomUUID();

    // Generate auth URL with correct scopes and device parameters
    const authUrl = await auth.getAuthUrl(state, {
      device_id: deviceId,
      device_name: 'TimeSheet App'
    });

    // Store state and device ID in cookies for verification
    res.setHeader(
      'Set-Cookie',
      [
        `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=3600`,
        `device_id=${deviceId}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=3600`
      ]
    );

    // Redirect to Google's auth page
    res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.redirect(`/admin/workspace?error=oauth_init_failed&message=${encodeURIComponent(errorMessage)}`);
  }
}