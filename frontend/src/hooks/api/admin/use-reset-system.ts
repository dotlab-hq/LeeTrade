import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import type { ResetSystemResponse } from '@/hooks/schemas'

export function useResetSystem() {
    return useMutation( {
        mutationFn: async () => {
            try {
                const response = await api.post<ResetSystemResponse>( '/api/v1/admin/system/reset', {} )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to reset system' ) )
            }
        },
    } )
}