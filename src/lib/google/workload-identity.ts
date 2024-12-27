import { GoogleAuth } from 'google-auth-library';
import { GoogleWorkspaceError } from './types';

export async function getWorkloadIdentityToken() {
  try {
    const serviceAccount = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!serviceAccount || !privateKey || !projectId) {
      throw new Error('Missing required service account configuration');
    }

    // Create the JWT client
    const auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.group'
      ],
      projectId: projectId,
      credentials: {
        client_email: serviceAccount,
        private_key: privateKey,
      }
    });

    try {
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      
      if (!token.token) {
        throw new Error('Failed to get access token');
      }

      return token.token;
    } catch (error: any) {
      console.error('Error getting service account token:', error);
      throw new GoogleWorkspaceError('Failed to get service account token', error);
    }
  } catch (error: any) {
    console.error('Error in getWorkloadIdentityToken:', error);
    throw new GoogleWorkspaceError('Failed to get service account token', error);
  }
}
