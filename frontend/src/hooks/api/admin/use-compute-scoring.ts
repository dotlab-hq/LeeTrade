import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'

export function useComputeScoring() {
    return useMutation( {
        mutationFn: async ( runId: string ) => {
            try {
                const response = await api.post<{ runId: string; finalScore: number }>( '/api/v1/scoring/compute', { runId } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to compute scoring' ) )
            }
        },
    } )
}