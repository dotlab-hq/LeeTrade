import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { submissionKeys } from '@/hooks/api/submissions/keys'
import type { BuildLogsResponse } from '@/hooks/schemas'

export function useSubmissionBuildLogs( id: string ) {
    return useQuery( {
        queryKey: [...submissionKeys.detail( id ), 'build-logs'] as const,
        queryFn: async () => {
            try {
                const response = await api.get<BuildLogsResponse>( `/api/v1/admin/submissions/${id}/build-logs` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load build logs' ) )
            }
        },
        enabled: !!id,
    } )
}