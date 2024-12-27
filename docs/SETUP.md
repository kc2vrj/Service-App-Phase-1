# Setup Guide

This guide will help you set up the Timesheet Application for development or production use.

## Prerequisites

1. Node.js (v14 or higher)
2. Google Workspace Admin Account
3. Firebase Project
4. Git

## Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Configure the following environment variables:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-oauth-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_OAUTH_REDIRECT_URI=your-redirect-uri

# Google Workspace
GOOGLE_WORKSPACE_DOMAIN=your-domain
GOOGLE_WORKLOAD_IDENTITY_PROVIDER=your-identity-provider
GOOGLE_SERVICE_ACCOUNT=your-service-account
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Google provider
3. Set up Firestore Database
4. Generate service account credentials
5. Add the credentials to your environment variables

## Google Workspace Setup

1. Set up a Google Cloud Project
2. Enable Admin SDK API
3. Configure OAuth consent screen
4. Create OAuth credentials
5. Set up Workload Identity Federation (for production)

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:3000`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Database Schema

The application uses Firestore with the following collections:

- `users`: User profiles and permissions
- `timesheets`: Timesheet entries
- Additional collections as needed

## Security Considerations

1. Always use environment variables for sensitive data
2. Implement proper role-based access control
3. Regular security audits
4. Keep dependencies updated
