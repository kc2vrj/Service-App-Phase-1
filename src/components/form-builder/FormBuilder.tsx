/**
 * FormBuilder.tsx
 * A dynamic form builder component that allows users to create and edit forms with drag-and-drop functionality.
 * This component uses react-hook-form for form management and dnd-kit for drag-and-drop capabilities.
 */

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldEditor } from './FieldEditor'
import { formSchema } from '@/lib/types/forms'
import { Grip, Plus, Trash } from 'lucide-react'
import type { FormField } from '@/lib/types/forms'

/**
 * Props interface for the FormBuilder component
 * @interface FormBuilderProps
 * @property {any} [initialForm] - Optional initial form data for editing existing forms
 * @property {function} onSave - Callback function to handle form submission
 */
interface FormBuilderProps {
  initialForm?: any
  onSave: (data: any) => Promise<void>
}

/**
 * SortableField Component
 * Renders a draggable form field with editing capabilities
 * @param {Object} props - Component props
 * @param {Object} props.field - Field data
 * @param {number} props.index - Field index
 * @param {Function} props.onRemove - Callback to remove field
 * @param {Object} props.control - Form control object
 */
function SortableField({ field, index, onRemove, control }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg border"
    >
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="mt-2 cursor-grab">
          <Grip className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <FieldEditor
            field={field}
            index={index}
            control={control}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * FormBuilder Component
 * A dynamic form builder that allows users to create and edit forms with drag-and-drop functionality
 * Features:
 * - Drag and drop field reordering
 * - Multiple field types support
 * - Form validation using Zod
 * - Real-time form preview
 */
export function FormBuilder({ initialForm, onSave }: FormBuilderProps) {
  // Initialize drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialForm || {
      name: '',
      description: '',
      fields: []
    }
  })

  // Setup field array handling
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'fields'
  })

  /**
   * Handles the end of a drag operation
   * Updates field positions when a field is dragged to a new position
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  /**
   * Adds a new field to the form
   * @param {string} type - The type of field to add
   */
  const addField = (type: string) => {
    if (!type) return
    append({
      id: crypto.randomUUID(),
      type,
      label: '',
      name: '',
      required: false,
      order: fields.length
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <div className="grid gap-4">
          {/* Form Details */}
          <div className="grid gap-4">
            <Input
              {...form.register('name')}
              placeholder="Form Name"
              className="text-xl font-bold"
            />
            <Input
              {...form.register('description')}
              placeholder="Form Description"
            />
          </div>

          {/* Field List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    index={index}
                    onRemove={remove}
                    control={form.control}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Add Field Button */}
        <div className="flex gap-2">
          <select
            onChange={(e) => addField(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Add Field...</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="select">Select</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit">
            {initialForm ? 'Update Form' : 'Create Form'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
