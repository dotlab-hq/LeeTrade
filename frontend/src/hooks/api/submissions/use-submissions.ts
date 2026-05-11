import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { submissionKeys } from '@/hooks/api/submissions/keys'
import type { Submission } from '@/hooks/schemas'

export function useSubmissions( filters: Record<string, unknown> = {} ) {
    return useQuery( {
        queryKey: submissionKeys.list( filters ),
        queryFn: async () => {
            try {
                const response = await api.get<{ submissions: Submission[] }>( '/api/v1/submissions' )
                return response.data.submissions || []
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load submissions' ) )
            }
        },
    } )
}
