// src/components/form-builder/DynamicFormRenderer.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { generateFormSchema } from '@/lib/utils/form-schema-generator'
import type { DynamicForm } from '@/lib/types/forms'

interface DynamicFormRendererProps {
  form: DynamicForm
  onSubmit: (data: any) => Promise<void>
  previewMode?: boolean
}

export function DynamicFormRenderer({
  form,
  onSubmit,
  previewMode = false
}: DynamicFormRendererProps) {
  const schema = generateFormSchema(form)
  const formMethods = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
        {previewMode && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md mb-4">
            Preview Mode - Submissions will not be saved
          </div>
        )}

        {form.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <FormField
              key={field.id}
              field={field}
              control={formMethods.control}
            />
          ))}

        <Button type="submit">
          {previewMode ? 'Test Submit' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
