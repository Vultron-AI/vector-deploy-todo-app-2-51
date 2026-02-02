import { Select } from '@/components/ui'
import type { TeamMember } from '@/types/models'

interface UserSelectorProps {
  teamMembers: TeamMember[]
  selectedUserId: string
  onUserChange: (userId: string) => void
}

export function UserSelector({
  teamMembers,
  selectedUserId,
  onUserChange,
}: UserSelectorProps) {
  const options = teamMembers.map((member) => ({
    value: member.id,
    label: member.name,
  }))

  return (
    <div data-testid="nav.user-selector" className="w-48">
      <Select
        value={selectedUserId}
        onValueChange={onUserChange}
        options={options}
        placeholder="Select user..."
      />
    </div>
  )
}
