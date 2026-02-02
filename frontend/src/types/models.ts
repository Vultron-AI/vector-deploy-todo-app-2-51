export interface TeamMember {
  id: string
  name: string
}

export interface Task {
  id: string
  title: string
  assigneeId: string
  completed: boolean
}
