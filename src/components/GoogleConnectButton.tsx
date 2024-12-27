// src/components/GoogleWorkspaceButton.tsx
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';

export const GoogleWorkspaceButton = () => {
  const handleConnect = () => {
    window.location.href = '/api/auth/google/login';
  };

  return (
    <Button 
      onClick={handleConnect}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Cloud className="w-4 h-4 mr-2" />
      Connect Google Workspace
    </Button>
  );
};