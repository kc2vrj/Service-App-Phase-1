/**
 * workspace.tsx
 * Admin page for managing Google Workspace integration and user synchronization.
 * This component handles OAuth authentication, service account connection,
 * and user synchronization between the application and Google Workspace.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Link, AlertTriangle, CheckCircle2, Cloud, Key, Users } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { hasAccess } from '@/lib/utils/role-utils';

/**
 * Interface defining the connection status for both OAuth and service account
 * @interface ConnectionStatus
 * @property {Object} oauth - OAuth connection details
 * @property {Object} serviceAccount - Service account connection details
 */
interface ConnectionStatus {
  oauth: {
    connected: boolean;
    email?: string;
    expiresAt?: Date;
  };
  serviceAccount: {
    connected: boolean;
    email?: string;
  };
}

/**
 * WorkspaceAdmin Component
 * Provides an admin interface for managing Google Workspace integration
 * Features:
 * - OAuth connection management
 * - Service account status monitoring
 * - User synchronization between app and Google Workspace
 * - Connection status monitoring
 */
export default function WorkspaceAdmin() {
  // State management for component
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    oauth: { connected: false },
    serviceAccount: { connected: false }
  });
  const [syncStats, setSyncStats] = useState<any>(null);

  /**
   * Effect hook to handle authentication and authorization
   * Redirects unauthorized users and initializes workspace admin
   */
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!hasAccess(user.role, 'ADMIN') && user.role !== 'DEVELOPER') {
      router.push('/403');
      return;
    }

    const checkStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user's token
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        const token = await currentUser.getIdToken(true);
        await checkConnectionStatus(token);
      } catch (err) {
        console.error('Error initializing workspace admin:', err);
        setError('Failed to initialize workspace admin');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, router]);

  /**
   * Effect hook to handle URL query parameters
   * Updates error state based on query parameters
   */
  useEffect(() => {
    const { status, error: queryError, message } = router.query;
    if (status === 'success') {
      setError(null);
    } else if (status === 'error') {
      setError(queryError as string || message as string || 'Failed to connect to Google Workspace');
    }
  }, [router.query]);

  /**
   * Checks the connection status for both OAuth and service account
   * @param {string} token - Firebase authentication token
   */
  const checkConnectionStatus = async (token: string) => {
    if (!user) return;
    
    try {      
      // Check if workspace_tokens collection and document exist
      try {
        const tokensDoc = await getDoc(doc(db, 'workspace_tokens', user.id));
        
        // Check OAuth status
        if (tokensDoc.exists()) {
          const data = tokensDoc.data();
          setConnectionStatus(prev => ({
            ...prev,
            oauth: {
              connected: true,
              email: data.email,
              expiresAt: data.expiresAt?.toDate()
            }
          }));
          if (data.lastSync) {
            setLastSync(new Date(data.lastSync));
          }
        }
      } catch (err) {
        console.warn('No workspace tokens found:', err);
        // Don't throw error here, just continue checking service account
      }

      // Check service account status
      try {
        const response = await fetch('/api/check-service-account', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Service account check failed');
        }

        const data = await response.json();
        setConnectionStatus(prev => ({
          ...prev,
          serviceAccount: {
            connected: true,
            email: data.email
          }
        }));
      } catch (err) {
        console.warn('Service account check failed:', err);
        setConnectionStatus(prev => ({
          ...prev,
          serviceAccount: {
            connected: false,
            email: undefined
          }
        }));
      }
    } catch (err) {
      console.error('Error checking connection status:', err);
      setError('Failed to check connection status');
    }
  };

  /**
   * Initiates OAuth connection flow
   * Redirects user to Google login page
   */
  const handleConnect = () => {
    window.location.href = '/api/auth/google/login';
  };

  /**
   * Initiates user synchronization between app and Google Workspace
   * Updates sync status and stats
   */
  const handleSync = async () => {
    if (!user) return;

    try {
      setSyncStatus('syncing');
      setSyncStats(null);
      setError(null);

      // Get fresh token
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const token = await currentUser.getIdToken(true);

      const response = await fetch('/api/sync-workspace-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }

      const result = await response.json();
      setSyncStatus('success');
      setSyncStats(result.details);
      setLastSync(new Date());
    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSyncStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Google Workspace Integration</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Connection Status Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* OAuth Connection */}
          <Card>
            <CardHeader>
              <CardTitle>User Connection</CardTitle>
              <CardDescription>
                Connect with your Google Workspace account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {connectionStatus.oauth.connected ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-green-600 font-medium">Connected</p>
                          <p className="text-sm text-gray-500">{connectionStatus.oauth.email}</p>
                          {connectionStatus.oauth.expiresAt && (
                            <p className="text-xs text-gray-400">
                              Expires: {connectionStatus.oauth.expiresAt.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Link className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Not connected</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={handleConnect}
                    variant={connectionStatus.oauth.connected ? 'outline' : 'default'}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {connectionStatus.oauth.connected ? 'Reconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Account Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Service Account</CardTitle>
              <CardDescription>
                Automated system access to Google Workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {connectionStatus.serviceAccount.connected ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-green-600 font-medium">Connected</p>
                          <p className="text-sm text-gray-500">{connectionStatus.serviceAccount.email}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-600">Not configured</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Controls Card */}
        {(connectionStatus.oauth.connected || connectionStatus.serviceAccount.connected) && (
          <Card>
            <CardHeader>
              <CardTitle>User Synchronization</CardTitle>
              <CardDescription>
                Sync users from Google Workspace to your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last synced:</p>
                    <p className="font-medium">
                      {lastSync 
                        ? lastSync.toLocaleDateString() + ' ' + lastSync.toLocaleTimeString()
                        : 'Never'}
                    </p>
                  </div>
                  <Button
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Sync Users
                      </>
                    )}
                  </Button>
                </div>

                {syncStats && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Last Sync Results:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Added:</p>
                        <p className="font-medium">{syncStats.added}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Updated:</p>
                        <p className="font-medium">{syncStats.updated}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Skipped:</p>
                        <p className="font-medium">{syncStats.skipped}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Errors:</p>
                        <p className="font-medium text-red-600">{syncStats.errors}</p>
                      </div>
                    </div>
                  </div>
                )}

                {syncStatus === 'success' && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      User synchronization completed successfully
                    </AlertDescription>
                  </Alert>
                )}

                {syncStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to synchronize users. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}