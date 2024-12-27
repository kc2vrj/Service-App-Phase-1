// functions/handleWorkspaceUserChange.js
import { GoogleWorkspaceAuth } from '../lib/googleWorkspace';

export const handleWorkspaceUserChange = async (req, res) => {
  // Verify request is from Google
  const token = req.headers['x-goog-channel-token'];
  if (token !== process.env.WORKSPACE_WEBHOOK_TOKEN) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const workspaceAuth = new GoogleWorkspaceAuth();
    await workspaceAuth.initialize();
    
    // Sync all users to ensure consistency
    const result = await workspaceAuth.syncUsers();
    
    if (result.success) {
      res.status(200).send('Users synchronized successfully');
    } else {
      res.status(500).send(result.error);
    }
  } catch (error) {
    console.error('Error handling workspace change:', error);
    res.status(500).send(error.message);
  }
};