// src/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { TimesheetProvider } from '../components/timesheet/TimesheetContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Navigation from '../components/Navigation1';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary 
      name="RootErrorBoundary"
      fallbackMessage="The application encountered an unexpected error."
    >
      <AuthProvider>
        <TimesheetProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto">
              <Component {...pageProps} />
            </main>
          </div>
        </TimesheetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;