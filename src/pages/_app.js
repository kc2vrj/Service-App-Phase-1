import '../styles/globals.css';
import '../styles/themes.css';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Navigation from '../components/Navigation1';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto">
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;