// src/components/form-builder/FieldEditor.tsx
import { Control } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { FormField as IFormField } from '@/lib/types/forms'

interface FieldEditorProps {
  field: IFormField
  index: number
  control: Control<any>
}

export function FieldEditor({ field, index, control }: FieldEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`fields.${index}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`fields.${index}.helpText`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Help Text</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`fields.${index}.required`}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Required Field</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {field.type === 'select' && (
        <FormField
          control={control}
          name={`fields.${index}.options`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="One option per line"
                  value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                  onChange={(e) => field.onChange(e.target.value.split('\n'))}
                />
              </FormControl>
              <FormDescription>
                Enter each option on a new line
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
