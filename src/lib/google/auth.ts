/**
 * Google Workspace Authentication Module
 * 
 * This module provides authentication functionality for Google Workspace integration,
 * supporting both OAuth2 and Service Account authentication methods.
 * 
 * @module GoogleWorkspaceAuth
 */

import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { getWorkloadIdentityToken } from './workload-identity';
import { 
  GoogleTokenData,
  GoogleWorkspaceError
} from './types';

/**
 * Interface for device authentication parameters
 * @interface DeviceParams
 */
interface DeviceParams {
  device_id: string;
  device_name: string;
}

/**
 * Handles authentication with Google Workspace services
 * @class GoogleWorkspaceAuth
 */
export class GoogleWorkspaceAuth {
  private oauth2Client: OAuth2Client;
  private domain: string;
  private serviceAccount: string;

  /**
   * Creates an instance of GoogleWorkspaceAuth
   * @throws {Error} If required OAuth or service account configuration is missing
   */
  constructor() {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
    const serviceAccount = process.env.FIREBASE_CLIENT_EMAIL;
    this.domain = process.env.GOOGLE_WORKSPACE_DOMAIN || '';

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required OAuth configuration');
    }

    if (!serviceAccount) {
      throw new Error('Missing required service account configuration');
    }

    this.serviceAccount = serviceAccount;

    this.oauth2Client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri,
    });
  }

  /**
   * Gets an authenticated Admin Directory API client
   * @param {('oauth2'|'serviceAccount')} type - Authentication type to use
   * @returns {Promise<any>} Authenticated Admin Directory API client
   * @throws {GoogleWorkspaceError} If authentication fails
   */
  async getAdminDirectory(type: 'oauth2' | 'serviceAccount' = 'serviceAccount'): Promise<any> {
    try {
      let auth;
      
      if (type === 'serviceAccount') {
        const token = await getWorkloadIdentityToken();
        auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: token });
      } else {
        auth = this.oauth2Client;
      }

      return google.admin({ version: 'directory_v1', auth });
    } catch (error) {
      console.error('Error getting admin directory:', error);
      throw new GoogleWorkspaceError('Failed to initialize admin directory', error);
    }
  }

  /**
   * Generates an authentication URL for the user to authorize access
   * @param {string} state - State parameter for the authentication URL
   * @param {DeviceParams} [deviceParams] - Device authentication parameters
   * @returns {Promise<string>} Authentication URL
   */
  async getAuthUrl(state: string, deviceParams?: DeviceParams): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/admin.directory.group.readonly',
      'openid',
      'profile',
      'email'
    ];

    const params: any = {
      access_type: 'offline',
      scope: scopes.join(' '),
      state,
      prompt: 'consent'
    };

    // Add device parameters if provided (needed for private IP redirect URIs)
    if (deviceParams) {
      params.device_id = deviceParams.device_id;
      params.device_name = deviceParams.device_name;
    }

    return this.oauth2Client.generateAuthUrl(params);
  }

  /**
   * Handles the OAuth callback and returns the authentication result
   * @param {string} code - Authorization code from the OAuth callback
   * @returns {Promise<GoogleTokenData>} Authentication result
   * @throws {GoogleWorkspaceError} If authentication fails
   */
  async handleCallback(code: string): Promise<GoogleTokenData> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      return {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        expiresAt: new Date(Date.now() + (tokens.expiry_date || 0)),
        email: userInfo.email!,
        name: userInfo.name!,
        picture: userInfo.picture,
      };
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw new GoogleWorkspaceError('Failed to handle OAuth callback', error);
    }
  }
}
