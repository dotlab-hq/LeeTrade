import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { submissionKeys } from '@/hooks/api/submissions/keys'
import type { SubmissionStatusResponse } from '@/hooks/schemas'

export function useSubmissionStatus( id: string ) {
    return useQuery( {
        queryKey: submissionKeys.status( id ),
        queryFn: async () => {
            try {
                const response = await api.get<SubmissionStatusResponse>( `/api/v1/submissions/${id}/status` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load submission status' ) )
            }
        },
        enabled: !!id,
        refetchInterval: ( query ) => {
            const status = query.state.data?.status
            if ( status === 'completed' || status === 'failed' || status === 'build_failed' ) return false
            return 5000
        },
    } )
}