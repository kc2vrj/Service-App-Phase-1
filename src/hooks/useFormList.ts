// src/hooks/useFormList.ts
import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DynamicForm } from '@/lib/form-builder/types'

export function useFormList() {
  const [forms, setForms] = useState<DynamicForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formsRef = collection(db, 'forms')
        const q = query(formsRef, orderBy('updatedAt', 'desc'))
        const snapshot = await getDocs(q)
        
        const formsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DynamicForm[]

        setForms(formsList)
      } catch (err) {
        console.error('Error fetching forms:', err)
        setError('Failed to load forms')
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  return { forms, loading, error }
}