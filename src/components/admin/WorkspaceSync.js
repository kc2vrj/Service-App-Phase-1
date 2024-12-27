// src/components/admin/WorkspaceSync.js
import { Button } from '@/components/ui/button';

const GoogleTestButton = () => {
  return (
    <Button
      onClick={() => window.location.href = '/api/auth/google/login'}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Test Google Connection
    </Button>
  );
};

export default GoogleTestButton;