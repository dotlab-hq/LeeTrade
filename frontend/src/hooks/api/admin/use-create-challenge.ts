import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'
import type { CreateChallengeInput } from '@/hooks/schemas'

export function useCreateChallenge() {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: async ( input: CreateChallengeInput ) => {
            try {
                const response = await api.post<{ id: string; slug: string; published: boolean }>( '/api/v1/admin/challenges', input )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to create challenge' ) )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: adminKeys.challenges() } )
        },
    } )
}