// pages/developer/forms/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Plus, Edit, Eye } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui/card'

interface FormData {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'archived'
}

export default function DeveloperFormsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [forms, setForms] = useState<FormData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (!['DEVELOPER', 'SUPER_ADMIN'].includes(user.role)) {
        router.push('/')
        return
      }

      fetchForms()
    }
  }, [user, authLoading, router])

  const fetchForms = async () => {
    try {
      const formsRef = collection(db, 'forms')
      const q = query(formsRef, orderBy('updatedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const formsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FormData[]

      setForms(formsList)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching forms:', err)
      setError('Failed to load forms')
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Form Management</h1>
          <p className="text-gray-600">Create and manage dynamic forms</p>
        </div>
        <Button onClick={() => router.push('/developer/forms/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{form.name}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/developer/forms/${form.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/developer/forms/${form.id}/preview`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(form.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}