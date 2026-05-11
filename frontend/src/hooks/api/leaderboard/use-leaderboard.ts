import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { leaderboardKeys } from '@/hooks/api/leaderboard/keys'
import type { LeaderboardResponse } from '@/hooks/schemas'

export function useLeaderboard( challengeId: string ) {
    return useQuery( {
        queryKey: leaderboardKeys.byChallenge( challengeId ),
        queryFn: async () => {
            try {
                const response = await api.get<LeaderboardResponse>( `/api/v1/leaderboard/${challengeId}` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load leaderboard' ) )
            }
        },
        enabled: !!challengeId,
        staleTime: 30 * 1000,
    } )
}