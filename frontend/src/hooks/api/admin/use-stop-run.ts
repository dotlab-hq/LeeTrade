import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'

export function useStopRun() {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: async ( runId: string ) => {
            try {
                const response = await api.post<{ runId: string; status: string }>( `/api/v1/admin/runs/${runId}/stop`, {} )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to stop run' ) )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: adminKeys.all } )
        },
    } )
}