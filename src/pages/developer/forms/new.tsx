// src/pages/developer/forms/new.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDevAccess } from '@/hooks/useDevAccess'
import { FormBuilder } from '@/components/form-builder/FormBuilder'
import { doc, collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewFormPage() {
  const router = useRouter()
  const { isDeveloper, isAuthenticated } = useDevAccess()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Redirect if not authenticated or not a developer
  if (!isAuthenticated || !isDeveloper) {
    if (typeof window !== 'undefined') {
      router.push('/403')
    }
    return null
  }

  const handleSave = async (formData: any) => {
    try {
      setSaving(true)
      setError(null)

      // Add metadata
      const newForm = {
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'forms'), newForm)

      // Redirect to edit page
      router.push(`/developer/forms/${docRef.id}/edit`)
    } catch (err) {
      console.error('Error saving form:', err)
      setError('Failed to save form. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/developer/forms')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>
        <h1 className="text-2xl font-bold">Create New Form</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <FormBuilder onSave={handleSave} />
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-center">Saving form...</p>
          </div>
        </div>
      )}
    </div>
  )
}