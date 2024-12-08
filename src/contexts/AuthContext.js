import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe;
    const auth = getAuth();

    const handleAuthStateChanged = async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();

            // Check if password change is required
            if (userData.forcePasswordChange && router.pathname !== '/change-password') {
              router.push('/change-password');
            }

            // Set user data
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData?.firstName,
              lastName: userData?.lastName,
              role: userData?.role || 'user',
              forcePasswordChange: userData?.forcePasswordChange
            });
          } else {
            console.warn('User document not found in Firestore');
            setUser(null);
          }
        } else {
          setUser(null);
          if (router.pathname !== '/login' && router.pathname !== '/register') {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('Error getting user data:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    try {
      unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    } catch (err) {
      console.error('Error setting up auth listener:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  const login = async (email, password) => {
    try {
      setError(null);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData.forcePasswordChange) {
        router.push('/change-password');
      } else {
        router.push('/');
      }
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return false;
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
      setError(err.message);
    }
  };

  // If there's an error, show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Connection Error</h2>
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
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);