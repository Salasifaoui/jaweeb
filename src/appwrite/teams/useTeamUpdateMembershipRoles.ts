'use client'

import { useMutation } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'
import { useAppwrite } from '@/src/appwrite/AppwriteProvider'

type Props = {
  teamId: string,
  membershipId: string,
  roles: string[],
}

/**
 * Modify the roles of a team member.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/teams?sdk=web-default#teamsUpdateMembershipRoles)
 */
export function useTeamUpdateMembershipRoles() {
  const { teams } = useAppwrite()
  const mutation = useMutation<Models.Membership, unknown, Props, unknown>({
    mutationFn: async ({ teamId, membershipId, roles }) => {
      return teams.updateMembershipRoles(teamId, membershipId, roles)
    },
  })

  return mutation
}
