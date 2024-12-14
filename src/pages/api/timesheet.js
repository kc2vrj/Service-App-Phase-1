// pages/api/timesheet.js
import { withAuth, validateRequest, sanitizeInput, timesheetSchema } from '../../middleware/security';
import { db } from '../../lib/firebase';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = validateRequest(timesheetSchema)(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const sanitizedData = sanitizeInput(req.body);
  
  try {
    await db.collection('timesheet_entries').add({
      ...sanitizedData,
      userId: req.user.uid,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Entry created successfully' });
  } catch (error) {
    console.error('Timesheet creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default withAuth(handler);