// src/middleware/withDevAccess.ts
  import { NextApiRequest, NextApiResponse } from 'next'
  import { getAuth } from 'firebase-admin/auth'
  import { db } from '@/lib/firebase-admin'
  
  export function withDevAccess(handler: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized' })
        }
  
        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await getAuth().verifyIdToken(token)
        
        // Get user from Firestore to check role
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()
        const userData = userDoc.data()
  
        if (!userData || (userData.role !== 'DEVELOPER' && userData.role !== 'SUPER_ADMIN')) {
          return res.status(403).json({ error: 'Developer access required' })
        }
  
        req.user = { ...decodedToken, role: userData.role }
        return handler(req, res)
      } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(401).json({ error: 'Unauthorized' })
      }
    }
  }