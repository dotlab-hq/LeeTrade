import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'

export function useBuildSubmission() {
    return useMutation( {
        mutationFn: async ( submissionId: string ) => {
            try {
                const response = await api.post<{ submissionId: string; status: string }>( '/api/v1/orchestrator/build', {
                    submissionId,
                } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to build submission' ) )
            }
        },
    } )
}