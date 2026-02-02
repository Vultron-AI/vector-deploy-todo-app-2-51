import { useState, useMemo } from 'react'
import { DialogProvider, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { TaskList } from '@/components/TaskList'
import { TaskForm } from '@/components/TaskForm'
import { UserSelector } from '@/components/UserSelector'
import { tasksApi } from '@/services/tasksApi'
import { teamApi } from '@/services/teamApi'
import type { Task, TeamMember } from '@/types/models'

function AppContent() {
  const teamMembers = useMemo<TeamMember[]>(() => teamApi.list(), [])
  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    const members = teamApi.list()
    return members.length > 0 ? members[0].id : ''
  })
  const [taskVersion, setTaskVersion] = useState(0)

  const tasks = useMemo<Task[]>(() => {
    // taskVersion is used to trigger re-computation when tasks change
    void taskVersion
    if (selectedUserId) {
      return tasksApi.listByAssignee(selectedUserId)
    }
    return []
  }, [selectedUserId, taskVersion])

  const handleCreateTask = (title: string, assigneeId: string) => {
    tasksApi.create({ title, assigneeId })
    setTaskVersion((v) => v + 1)
  }

  const handleToggleComplete = (taskId: string) => {
    tasksApi.toggleComplete(taskId)
    setTaskVersion((v) => v + 1)
  }

  const selectedUser = teamMembers.find((m) => m.id === selectedUserId)

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-fg)]">
            Team Task Tracker
          </h1>
          <UserSelector
            teamMembers={teamMembers}
            selectedUserId={selectedUserId}
            onUserChange={handleUserChange}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm
                teamMembers={teamMembers}
                onSubmit={handleCreateTask}
              />
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
              {selectedUser ? `${selectedUser.name}'s Tasks` : 'My Tasks'}
            </h2>
            <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <DialogProvider>
      <AppContent />
    </DialogProvider>
  )
}

export default App
