import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'
import type { PaginatedUsersResponse } from '@/hooks/schemas'

export function useUsers( page: number = 1, pageSize: number = 20 ) {
    return useQuery( {
        queryKey: adminKeys.users( page, pageSize ),
        queryFn: async () => {
            try {
                const response = await api.get<PaginatedUsersResponse>( `/api/v1/admin/users?page=${page}&pageSize=${pageSize}` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load users' ) )
            }
        },
    } )
}