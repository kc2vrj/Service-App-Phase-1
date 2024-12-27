// src/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { TimesheetProvider } from '../components/timesheet/TimesheetContext';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary 
      name="RootErrorBoundary"
      fallbackMessage="The application encountered an unexpected error."
    >
      <AuthProvider>
        <TimesheetProvider>
          <Component {...pageProps} />
        </TimesheetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;