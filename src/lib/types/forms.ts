// src/lib/types/forms.ts
import { z } from 'zod'

export const fieldTypes = [
  'text',
  'number',
  'email',
  'tel',
  'date',
  'time',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'location'
] as const

export type FieldType = typeof fieldTypes[number]

export const formSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(fieldTypes),
    label: z.string().min(1, 'Field label is required'),
    name: z.string().min(1, 'Field name is required'),
    helpText: z.string().optional(),
    required: z.boolean().default(false),
    order: z.number(),
    options: z.array(z.string()).optional(),
    validation: z.array(z.object({
      type: z.string(),
      params: z.array(z.any()).optional(),
      message: z.string()
    })).optional()
  }))
})

export type FormField = z.infer<typeof formSchema>['fields'][number]

export interface DynamicForm {
  id: string
  name: string
  description?: string
  fields: FormField[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'archived'
}
