import { Card, Badge } from '@/components/ui'
import type { Task } from '@/types/models'

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: string) => void
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div
        data-testid="tasks.list.empty-state"
        className="text-center py-12 text-[var(--color-muted)]"
      >
        <p className="text-lg">No tasks assigned</p>
        <p className="text-sm mt-1">Tasks assigned to you will appear here</p>
      </div>
    )
  }

  return (
    <div data-testid="tasks.list" className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          data-testid="tasks.list.item"
          className="flex items-center gap-3"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="h-5 w-5 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
          />
          <span
            className={`flex-1 ${task.completed ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-fg)]'}`}
          >
            {task.title}
          </span>
          <Badge variant={task.completed ? 'success' : 'default'}>
            {task.completed ? 'Completed' : 'Pending'}
          </Badge>
        </Card>
      ))}
    </div>
  )
}
