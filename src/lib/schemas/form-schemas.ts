import { z } from 'zod'
import { doc, setDoc, getDoc, collection } from 'firebase/firestore'
import { db } from '../firebase/config' // Adjust this import path as needed

// Type definitions for constants
export type FormStatusType = typeof FormStatus[keyof typeof FormStatus]
export type FormFieldTypeType = typeof FormFieldType[keyof typeof FormFieldType]

// Constants
export const FormStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
} as const

export const FormFieldType = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  DATE: 'date',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TEXTAREA: 'textarea'
} as const

// Base schemas
const ValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  customValidation: z.string().optional()
})

const OptionSchema = z.object({
  label: z.string(),
  value: z.string()
})

const ConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']),
  value: z.unknown()
})

// Form field schema
export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(Object.values(FormFieldType)),
  label: z.string().min(1).max(100),
  name: z.string().min(1).max(50),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  defaultValue: z.unknown().optional(),
  validation: ValidationSchema.optional(),
  options: z.array(OptionSchema).optional(),
  conditions: z.array(ConditionSchema).optional()
})

// Settings schema
const SettingsSchema = z.object({
  submitMessage: z.string().optional(),
  redirectUrl: z.string().url().optional(),
  allowMultipleSubmissions: z.boolean().default(false),
  requireAuth: z.boolean().default(false),
  notifyEmails: z.array(z.string().email()).optional(),
  layout: z.enum(['single', 'wizard', 'tabs']).default('single')
})

// Metadata schema
const MetadataSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
  version: z.number().int().positive()
})

// Main form schema
export const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(Object.values(FormStatus)),
  fields: z.array(FormFieldSchema),
  settings: SettingsSchema,
  metadata: MetadataSchema
})

// Type exports
export type FormField = z.infer<typeof FormFieldSchema>
export type Form = z.infer<typeof FormSchema>
export type FormValidation = z.infer<typeof ValidationSchema>
export type FormOption = z.infer<typeof OptionSchema>
export type FormCondition = z.infer<typeof ConditionSchema>
export type FormSettings = z.infer<typeof SettingsSchema>
export type FormMetadata = z.infer<typeof MetadataSchema>

// Helper function to get current user ID
const getCurrentUserId = (): string => {
  // Implement your user ID retrieval logic here
  // This is just a placeholder
  return 'default-user-id'
}

// Validation helper
export const validateForm = (data: unknown): Form => {
  return FormSchema.parse(data)
}

// Type guard
export const isFormData = (data: unknown): data is Form => {
  try {
    FormSchema.parse(data)
    return true
  } catch {
    return false
  }
}

// CRUD operations
export const createFormDocument = async (
  formData: Omit<Form, 'id' | 'metadata'>
): Promise<Form> => {
  try {
    const now = new Date().toISOString()
    const userId = getCurrentUserId()

    const newForm: Form = {
      id: crypto.randomUUID(),
      ...formData,
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1
      }
    }

    const validatedForm = validateForm(newForm)
    await setDoc(doc(db, 'forms', validatedForm.id), validatedForm)
    return validatedForm
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Form validation failed: ${error.message}`)
    }
    throw error
  }
}

export const updateFormDocument = async (
  formId: string,
  updates: Partial<Omit<Form, 'id' | 'metadata'>>
): Promise<Form> => {
  try {
    const now = new Date().toISOString()
    const userId = getCurrentUserId()

    const formDoc = await getDoc(doc(db, 'forms', formId))
    if (!formDoc.exists()) {
      throw new Error('Form not found')
    }

    const currentForm = formDoc.data() as Form
    const updatedForm: Form = {
      ...currentForm,
      ...updates,
      metadata: {
        ...currentForm.metadata,
        updatedAt: now,
        updatedBy: userId,
        version: currentForm.metadata.version + 1
      }
    }

    const validatedForm = validateForm(updatedForm)
    await setDoc(doc(db, 'forms', formId), validatedForm)
    return validatedForm
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Form validation failed: ${error.message}`)
    }
    throw error
  }
}
