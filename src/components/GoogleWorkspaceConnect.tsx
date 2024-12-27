// src/components/GoogleWorkspaceConnect.tsx
import React from 'react';
import { Button } from './ui/button';

export const GoogleWorkspaceConnect = () => {
  return (
    <Button 
      onClick={() => window.location.href = '/api/auth/google/login'}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Connect Google Workspace
    </Button>
  );
};