// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

const publicPaths = ['/', '/login', '/register'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();

  // Function to create or update user document
  const ensureUserDocument = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('Creating new user document...');
      // Create new user document
      const userData = {
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ')[1] || '',
        role: 'USER', // Default role
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await setDoc(userRef, userData);
      return { id: firebaseUser.uid, ...userData };
    } else {
      // Update last login
      const userData = userDoc.data();
      await setDoc(userRef, { 
        ...userData,
        lastLogin: new Date().toISOString() 
      }, { merge: true });
      
      return { id: firebaseUser.uid, ...userData };
    }
  };

  // Handle routing based on auth state
  useEffect(() => {
    if (!authInitialized) return;

    const path = router.pathname;
    if (!user && !publicPaths.includes(path)) {
      console.log('No user, redirecting to login from:', path);
      router.push('/login');
    } else if (user?.forcePasswordChange && path !== '/change-password') {
      console.log('Force password change, redirecting from:', path);
      router.push('/change-password');
    }
  }, [user, router.pathname, authInitialized]);

  // Handle auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await ensureUserDocument(firebaseUser);
          if (userData) {
            console.log('User data loaded:', userData);
            setUser(userData);
          } else {
            console.error('Failed to get or create user document');
            setUser(null);
          }
        } else {
          console.log('No user signed in');
          setUser(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user document exists
      await ensureUserDocument(result.user);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(getAuthErrorMessage(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'Invalid email or password',
      'auth/wrong-password': 'Invalid email or password',
      'auth/network-request-failed': 'Network connection error. Please check your internet connection.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    };

    return errorMessages[errorCode] || 'An error occurred during authentication';
  };

  if (loading && !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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