import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const router = useRouter();

  // Initialize Firebase Auth with persistence
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth = getAuth();
        await setPersistence(auth, browserLocalPersistence);
        
        // Set up emulator if in development
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication service');
      }
    };

    initializeAuth();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    let unsubscribe;
    let retryTimeout;
    const maxRetries = 3;

    const setupAuthListener = async () => {
      try {
        const auth = getAuth();

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setConnectionAttempts(0); // Reset counter on successful connection
          
          try {
            if (firebaseUser) {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userSnapshot = await getDoc(userDocRef);
              
              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                
                // Check for required password change
                if (userData.forcePasswordChange && router.pathname !== '/change-password') {
                  router.push('/change-password');
                }

                setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  firstName: userData?.firstName,
                  lastName: userData?.lastName,
                  role: userData?.role || 'USER',
                  forcePasswordChange: userData?.forcePasswordChange
                });
              } else {
                console.warn('User document not found in Firestore');
                setUser(null);
              }
            } else {
              setUser(null);
              if (!['/', '/login', '/register'].includes(router.pathname)) {
                router.push('/login');
              }
            }
          } catch (err) {
            console.error('Error processing auth state change:', err);
            setError('Failed to load user data');
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Auth state change error:', error);
          handleConnectionError();
        });

      } catch (err) {
        console.error('Error setting up auth listener:', err);
        handleConnectionError();
      }
    };

    const handleConnectionError = () => {
      setConnectionAttempts(prev => prev + 1);
      
      if (connectionAttempts < maxRetries) {
        // Exponential backoff for retries
        const retryDelay = Math.pow(2, connectionAttempts) * 1000;
        retryTimeout = setTimeout(setupAuthListener, retryDelay);
        
        setError({
          message: 'Connection issue detected. Retrying...',
          retryCount: connectionAttempts + 1,
          maxRetries
        });
      } else {
        setError({
          message: 'Unable to establish connection',
          isConnectionError: true
        });
      }
      setLoading(false);
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) unsubscribe();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [router, connectionAttempts]);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData?.forcePasswordChange) {
        router.push('/change-password');
      } else {
        router.push('/');
      }
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError({
        message: getAuthErrorMessage(err.code),
        code: err.code
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError({
        message: 'Failed to log out',
        code: err.code
      });
    }
  };

  // Helper function to provide user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'Invalid email or password',
      'auth/wrong-password': 'Invalid email or password',
      'auth/network-request-failed': 'Network connection error. Please check your internet connection.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Login popup was closed before completion.',
    };

    return errorMessages[errorCode] || 'An error occurred during authentication';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      error,
      isAuthenticated: !!user,
    }}>
      {error?.isConnectionError ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Connection Error</h2>
            <p className="text-gray-600 mb-4">
              There was a problem connecting to the service. Please try:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
              <li>Logging in again</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);