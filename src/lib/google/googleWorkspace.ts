import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getAuth } from 'firebase-admin/auth';
import { doc, setDoc, getDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';
import { errorLogger } from '../../services/errorLogging';
import { db } from '../firebase';

interface SyncLog {
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC_START' | 'SYNC_END' | 'ERROR';
  status: 'SUCCESS' | 'FAILURE';
  details: any;
  email?: string;
  error?: any;
}

interface WorkspaceUser {
  primaryEmail: string;
  name: {
    givenName: string;
    familyName: string;
  };
  suspended?: boolean;
  isEnrolledIn2Sv?: boolean;
}

interface SyncResult {
  success: boolean;
  details: {
    added: number;
    updated: number;
    removed: number;
    errors: number;
  };
  error?: string;
}

export class GoogleWorkspaceOAuth {
  private oauth2Client: OAuth2Client;
  private isDev: boolean;
  private domain: string;
  private logs: SyncLog[] = [];

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.domain = process.env.GOOGLE_WORKSPACE_DOMAIN || '';
    
    console.log('🔷 Initializing GoogleWorkspaceOAuth', {
      environment: this.isDev ? 'development' : 'production',
      domain: this.domain
    });

    if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
      const error = new Error('Missing required OAuth credentials');
      console.error('❌ OAuth Initialization Error:', error);
      throw error;
    }

    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    console.log('✅ GoogleWorkspaceOAuth initialized successfully');
  }

  private log(entry: SyncLog) {
    this.logs.push(entry);
    
    const logTime = new Date().toISOString();
    const logPrefix = `[${entry.action}]`;
    const statusColor = entry.status === 'SUCCESS' ? '🟢' : '🔴';
    
    console.group(`${statusColor} Workspace Sync ${logPrefix} - ${logTime}`);
    console.log('Status:', entry.status);
    console.log('Details:', entry.details);
    if (entry.email) console.log('Email:', entry.email);
    if (entry.error) {
      console.error('Error:', {
        message: entry.error.message,
        stack: entry.error.stack,
        code: entry.error.code
      });
    }
    console.groupEnd();
  }

  private async saveSyncLogs() {
    console.group('📝 Saving Sync Logs');
    try {
      const logsCollection = collection(db, 'workspace_sync_logs');
      const batchLogs = this.logs.map(log => {
        console.log(`Saving log: ${log.action} - ${log.status}`);
        return setDoc(doc(logsCollection), {
          ...log,
          environment: this.isDev ? 'development' : 'production',
          createdAt: new Date().toISOString()
        });
      });
      
      await Promise.all(batchLogs);
      console.log(`✅ Successfully saved ${this.logs.length} logs`);
    } catch (error) {
      console.error('❌ Error saving sync logs:', error);
      errorLogger.logError(error, {
        component: 'GoogleWorkspaceOAuth',
        method: 'saveSyncLogs',
      });
    }
    console.groupEnd();
  }

  generateAuthUrl() {
    console.log('🔄 Generating auth URL...');
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/admin.directory.group',
      ],
      prompt: 'consent'
    });
    console.log('✅ Auth URL generated successfully');
    return url;
  }

  async getTokens(code: string) {
    console.group('🔑 Getting tokens');
    try {
      console.log('Exchanging code for tokens...');
      const { tokens } = await this.oauth2Client.getToken(code);
      
      console.log('Tokens received:', {
        access_token: tokens.access_token ? '✅ Present' : '❌ Missing',
        refresh_token: tokens.refresh_token ? '✅ Present' : '❌ Missing',
        expiry_date: tokens.expiry_date
      });

      return tokens;
    } catch (error) {
      console.error('❌ Error getting tokens:', error);
      errorLogger.logError(error, {
        component: 'GoogleWorkspaceOAuth',
        method: 'getTokens',
      });
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  async storeTokens(userId: string, tokens: any) {
    console.group('💾 Storing tokens');
    try {
      console.log(`Storing tokens for user: ${userId}`);
      await setDoc(doc(db, 'workspace_tokens', userId), {
        tokens,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('✅ Tokens stored successfully');
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
      errorLogger.logError(error, {
        component: 'GoogleWorkspaceOAuth',
        method: 'storeTokens',
      });
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  async getStoredTokens(userId: string) {
    console.group('🔍 Retrieving stored tokens');
    try {
      console.log(`Fetching tokens for user: ${userId}`);
      const tokenDoc = await getDoc(doc(db, 'workspace_tokens', userId));
      if (!tokenDoc.exists()) {
        console.warn('⚠️ No tokens found for user');
        throw new Error('No tokens found');
      }
      console.log('✅ Tokens retrieved successfully');
      return tokenDoc.data().tokens;
    } catch (error) {
      console.error('❌ Error retrieving tokens:', error);
      errorLogger.logError(error, {
        component: 'GoogleWorkspaceOAuth',
        method: 'getStoredTokens',
      });
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  async syncUsers(userId: string): Promise<SyncResult> {
    console.group('🔄 Starting user sync');
    try {
      console.log('Getting stored tokens...');
      const tokens = await this.getStoredTokens(userId);
      this.oauth2Client.setCredentials(tokens);

      const service = google.admin({
        version: 'directory_v1',
        auth: this.oauth2Client
      });

      this.log({
        timestamp: new Date().toISOString(),
        action: 'SYNC_START',
        status: 'SUCCESS',
        details: 'Starting user sync'
      });

      console.log('Fetching users from Google Workspace...');
      const response = await service.users.list({
        customer: 'my_customer',
        domain: this.domain,
        orderBy: 'email',
        projection: 'full'
      });

      console.log(`Found ${response.data.users?.length || 0} users in Workspace`);
      const results = await this.processUsers(response.data.users || []);

      console.log('Sync completed with results:', results);
      await this.saveSyncLogs();

      return {
        success: true,
        details: results
      };
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.log({
        timestamp: new Date().toISOString(),
        action: 'SYNC_END',
        status: 'FAILURE',
        error: error
      });

      await this.saveSyncLogs();

      return {
        success: false,
        details: { added: 0, updated: 0, removed: 0, errors: 1 },
        error: error.message
      };
    } finally {
      console.groupEnd();
    }
  }

  private async removeNonExistentUsers(existingEmails: Set<string>): Promise<number> {
    console.group('🗑️ Removing non-existent users');
    let removedCount = 0;
    try {
      console.log('Fetching all users from Firestore...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (
          userData.email.endsWith(`@${this.domain}`) && 
          !existingEmails.has(userData.email)
        ) {
          console.log(`Removing user ${userData.email}...`);
          await this.deleteUser(userDoc.id, userData.email);
          removedCount++;
        }
      }
      
      console.log(`✅ Successfully removed ${removedCount} users`);
      return removedCount;
    } catch (error) {
      console.error('❌ Error removing users:', error);
      this.log({
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        status: 'FAILURE',
        details: 'Failed to process user removal',
        error
      });
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  private async deleteUser(uid: string, email: string) {
    console.group(`❌ Deleting user: ${email}`);
    try {
      const auth = getAuth();
      console.log('Deleting from Firebase Auth...');
      await auth.deleteUser(uid);
      
      console.log('Deleting from Firestore...');
      await deleteDoc(doc(db, 'users', uid));

      this.log({
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        status: 'SUCCESS',
        email,
        details: { userId: uid }
      });
      console.log('✅ User deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      this.log({
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        status: 'FAILURE',
        email,
        details: 'Failed to delete user',
        error
      });
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  private generateSecurePassword(): string {
    console.log('🔐 Generating secure password...');
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    const password = Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map(x => charset[x % charset.length])
      .join('');
    console.log('✅ Secure password generated');
    return password;
  }
}