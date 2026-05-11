import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'

export function useRunSubmission() {
    return useMutation( {
        mutationFn: async ( { submissionId, challengeId }: { submissionId: string; challengeId: string } ) => {
            try {
                const response = await api.post<{ runId: string; status: string }>( '/api/v1/orchestrator/run', {
                    submissionId,
                    challengeId,
                } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to run submission' ) )
            }
        },
    } )
}