import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'

export function useAdminChallenges() {
  return useQuery( {
    queryKey: adminKeys.challenges(),
    queryFn: async () => {
      try {
        const response = await api.get<{ challenges: Array<{ id: string; title: string; published: boolean }> }>(
          '/api/v1/admin/challenges'
        )
        return response.data
      } catch ( error ) {
        throw new Error( getApiErrorMessage( error, 'Failed to load admin challenges' ) )
      }
    },
  } )
}