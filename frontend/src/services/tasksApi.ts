import type { Task } from '@/types/models'

const STORAGE_KEY = 'team-task-tracker-tasks'

function getTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const tasksApi = {
  list: (): Task[] => {
    return getTasks()
  },

  listByAssignee: (assigneeId: string): Task[] => {
    return getTasks().filter((task) => task.assigneeId === assigneeId)
  },

  create: (data: Omit<Task, 'id' | 'completed'>): Task => {
    const tasks = getTasks()
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
    }
    tasks.push(newTask)
    saveTasks(tasks)
    return newTask
  },

  toggleComplete: (taskId: string): Task | null => {
    const tasks = getTasks()
    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) return null

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed,
    }
    saveTasks(tasks)
    return tasks[taskIndex]
  },

  delete: (taskId: string): boolean => {
    const tasks = getTasks()
    const filtered = tasks.filter((t) => t.id !== taskId)
    if (filtered.length === tasks.length) return false
    saveTasks(filtered)
    return true
  },
}
