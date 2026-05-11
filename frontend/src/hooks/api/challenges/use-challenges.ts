import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { challengeKeys } from '@/hooks/api/challenges/keys'

export function useChallenges() {
    return useQuery( {
        queryKey: challengeKeys.lists(),
        queryFn: async () => {
            try {
                const response = await api.get<{ challenges: Array<{ id: string; title: string; kind: string; slug: string }> }>(
                    '/api/v1/challenges'
                )
                return response.data.challenges || []
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load challenges' ) )
            }
        },
    } )
}