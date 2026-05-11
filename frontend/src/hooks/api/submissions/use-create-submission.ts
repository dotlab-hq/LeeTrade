import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import type { CreateSubmissionInput } from '@/hooks/schemas'

export function useCreateSubmission() {
    return useMutation( {
        mutationFn: async ( input: CreateSubmissionInput ) => {
            try {
                const response = await api.post<{ id: string; status: string }>( '/api/v1/submissions', input )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to create submission' ) )
            }
        },
    } )
}