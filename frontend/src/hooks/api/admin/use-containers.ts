import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'
import type { ContainerSummary } from '@/hooks/schemas'

export function useContainers( showAll: boolean = false ) {
    return useQuery( {
        queryKey: adminKeys.containers( showAll ),
        queryFn: async () => {
            try {
                const response = await api.get<{ containers: ContainerSummary[] }>(
                    `/api/v1/admin/containers${showAll ? '?all=true' : ''}`
                )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load containers' ) )
            }
        },
    } )
}