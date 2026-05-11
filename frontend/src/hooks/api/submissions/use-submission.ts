import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { submissionKeys } from '@/hooks/api/submissions/keys'
import type { Submission } from '@/hooks/schemas'

export function useSubmission( id: string ) {
    return useQuery( {
        queryKey: submissionKeys.detail( id ),
        queryFn: async () => {
            try {
                const response = await api.get<Submission>( `/api/v1/submissions/${id}` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load submission' ) )
            }
        },
        enabled: !!id,
    } )
}