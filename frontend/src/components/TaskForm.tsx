import { useState } from 'react'
import { Button, Input, Select } from '@/components/ui'
import type { TeamMember } from '@/types/models'

interface TaskFormProps {
  teamMembers: TeamMember[]
  onSubmit: (title: string, assigneeId: string) => void
}

export function TaskForm({ teamMembers, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [assigneeId, setAssigneeId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assigneeId) return

    onSubmit(title.trim(), assigneeId)
    setTitle('')
    setAssigneeId('')
  }

  const memberOptions = teamMembers.map((member) => ({
    value: member.id,
    label: member.name,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        data-testid="tasks.form.title"
        label="Task Title"
        placeholder="Enter task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-fg)]">
          Assign To
        </label>
        <Select
          data-testid="tasks.form.assignee"
          value={assigneeId}
          onValueChange={setAssigneeId}
          options={memberOptions}
          placeholder="Select team member..."
        />
      </div>

      <Button
        data-testid="tasks.form.submit"
        type="submit"
        disabled={!title.trim() || !assigneeId}
        className="w-full"
      >
        Create Task
      </Button>
    </form>
  )
}
