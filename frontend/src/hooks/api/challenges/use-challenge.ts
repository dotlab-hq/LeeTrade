import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { challengeKeys } from '@/hooks/api/challenges/keys'

export function useChallenge( id: string ) {
    return useQuery( {
        queryKey: challengeKeys.detail( id ),
        queryFn: async () => {
            try {
                const response = await api.get<{
                    id: string
                    title: string
                    slug: string
                    kind: string
                    protocol: string
                    published: boolean
                    createdAt: string
                }>( `/api/v1/challenges/${id}` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load challenge' ) )
            }
        },
        enabled: !!id,
    } )
}