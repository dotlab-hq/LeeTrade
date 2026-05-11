import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'

export function usePublishChallenge() {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: async ( id: string ) => {
            try {
                const response = await api.post<{ id: string; published: boolean }>( `/api/v1/admin/challenges/${id}/publish`, {} )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to publish challenge' ) )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: adminKeys.challenges() } )
        },
    } )
}