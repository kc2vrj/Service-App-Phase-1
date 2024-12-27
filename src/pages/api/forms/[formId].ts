// src/pages/api/forms/[formId].ts
import { withDevAccess } from '@/middleware/withDevAccess'
import { db } from '@/lib/firebase-admin'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formId } = req.query
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const doc = await db.collection('forms').doc(formId as string).get()
        if (!doc.exists) {
          return res.status(404).json({ error: 'Form not found' })
        }
        return res.status(200).json({ id: doc.id, ...doc.data() })
      } catch (error) {
        console.error('Error fetching form:', error)
        return res.status(500).json({ error: 'Failed to fetch form' })
      }

    case 'PUT':
      try {
        const updates = req.body
        await db.collection('forms').doc(formId as string).update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        return res.status(200).json({ message: 'Form updated successfully' })
      } catch (error) {
        console.error('Error updating form:', error)
        return res.status(500).json({ error: 'Failed to update form' })
      }

    case 'DELETE':
      try {
        await db.collection('forms').doc(formId as string).delete()
        return res.status(200).json({ message: 'Form deleted successfully' })
      } catch (error) {
        console.error('Error deleting form:', error)
        return res.status(500).json({ error: 'Failed to delete form' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${method} not allowed` })
  }
}

export default withDevAccess(handler)