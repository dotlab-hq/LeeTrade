import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'

export function useSignOut() {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: async () => {
            try {
                const response = await api.post( '/api/auth/sign-out' )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Sign out failed' ) )
            }
        },
        onSuccess: () => {
            queryClient.clear()
        },
    } )
}