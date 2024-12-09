// pages/_app.js
import '../styles/globals.css';
import '../styles/themes.css';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Navigation from '../components/Navigation1';
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyApp({ Component, pageProps }) {
  const { handleError } = useErrorHandler('AppRoot');

  return (
    <ErrorBoundary 
      name="RootErrorBoundary"
      fallbackMessage="The application encountered an unexpected error."
    >
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