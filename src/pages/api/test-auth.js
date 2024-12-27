// src/pages/api/test-auth.js
import { withAuth } from '../../middleware/security';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // If we reach here, authentication was successful
  res.status(200).json({
    message: 'Authentication successful',
    user: req.user
  });
}

export default withAuth(handler);