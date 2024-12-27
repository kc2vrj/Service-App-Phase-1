// src/lib/utils/form-schema-generator.ts
import { z } from 'zod'
import type { DynamicForm, FormField } from '@/lib/types/forms'

export function generateFormSchema(form: DynamicForm) {
  const shape: Record<string, z.ZodType<any>> = {}

  form.fields.forEach((field) => {
    let schema: z.ZodType<any>

    switch (field.type) {
      case 'text':
        schema = z.string()
        break
      case 'email':
        schema = z.string().email()
        break
      case 'number':
        schema = z.number()
        break
      case 'tel':
        schema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        break
      case 'date':
        schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
        break
      case 'select':
        schema = field.options 
          ? z.enum(field.options as [string, ...string[]])
          : z.string()
        break
      case 'location':
        schema = z.object({
          latitude: z.number(),
          longitude: z.number(),
          address: z.string().optional()
        })
        break
      default:
        schema = z.string()
    }

    if (field.required) {
      shape[field.name] = schema
    } else {
      shape[field.name] = schema.optional()
    }
  })

  return z.object(shape)
}

export function validateField(field: FormField, value: any): string | null {
  try {
    const schema = generateFieldSchema(field)
    schema.parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message
    }
    return 'Invalid value'
  }
}

function generateFieldSchema(field: FormField): z.ZodType<any> {
  let schema: z.ZodType<any>

  switch (field.type) {
    case 'text':
      schema = z.string()
      break
    case 'email':
      schema = z.string().email()
      break
    case 'number':
      schema = z.number()
      break
    case 'tel':
      schema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
      break
    case 'date':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
      break
    default:
      schema = z.string()
  }

  if (field.validation?.length) {
    field.validation.forEach((validation) => {
      switch (validation.type) {
        case 'min':
          if (field.type === 'number') {
            schema = schema.min(validation.params?.[0] || 0, validation.message)
          } else {
            schema = schema.min(validation.params?.[0] || 0, validation.message)
          }
          break
        case 'max':
          if (field.type === 'number') {
            schema = schema.max(validation.params?.[0] || 0, validation.message)
          } else {
            schema = schema.max(validation.params?.[0] || 0, validation.message)
          }
          break
        case 'regex':
          if (validation.params?.[0]) {
            schema = schema.regex(
              new RegExp(validation.params
