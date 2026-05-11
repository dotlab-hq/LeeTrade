import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { authKeys } from '@/hooks/api/auth/keys'
import type { SessionResponse } from '@/hooks/schemas'

export function useMe() {
    return useQuery( {
        queryKey: authKeys.me(),
        queryFn: async () => {
            try {
                const response = await api.get<SessionResponse>( '/api/v1/auth/me' )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load session' ) )
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    } )
}