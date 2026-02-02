import type { TeamMember } from '@/types/models'

const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Carol Williams' },
  { id: '4', name: 'David Brown' },
]

export const teamApi = {
  list: (): TeamMember[] => {
    return TEAM_MEMBERS
  },

  getById: (id: string): TeamMember | undefined => {
    return TEAM_MEMBERS.find((member) => member.id === id)
  },
}
