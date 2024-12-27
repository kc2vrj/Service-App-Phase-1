import { Credentials } from 'google-auth-library';

export interface GoogleTokenData {
  tokens: Credentials;
  expiresAt: Date;
  updatedAt: Date;
  userId: string;
  email?: string;
}

export interface EncryptedTokenData {
  encryptedTokens: string;
  expiresAt: Date;
  updatedAt: Date;
  userId: string;
  email?: string;
}

export interface GoogleWorkspaceConfig {
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  workspaceDomain: string;
}

export type AuthMethod = 'oauth2' | 'serviceAccount';

export class GoogleWorkspaceError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, error?: any) {
    super(message);
    this.name = 'GoogleWorkspaceError';
    if (error) {
      this.code = error.code;
      this.status = error.status;
    }
  }
}
