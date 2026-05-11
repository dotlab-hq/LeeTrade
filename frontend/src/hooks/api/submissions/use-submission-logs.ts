import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { submissionKeys } from '@/hooks/api/submissions/keys'
import type { SubmissionLogsResponse } from '@/hooks/schemas'

export function useSubmissionLogs( id: string ) {
    return useQuery( {
        queryKey: submissionKeys.logs( id ),
        queryFn: async () => {
            try {
                const response = await api.get<SubmissionLogsResponse>( `/api/v1/submissions/${id}/logs` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load submission logs' ) )
            }
        },
        enabled: !!id,
    } )
}