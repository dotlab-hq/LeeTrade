import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'
import type { UpdateUserRoleInput } from '@/hooks/schemas'

export function useUpdateUserRole() {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: async ( { userId, role }: { userId: string; role: UpdateUserRoleInput['role'] } ) => {
            try {
                const response = await api.put<{ user: { id: string; role: string } }>( `/api/v1/admin/users/${userId}/role`, {
                    role,
                } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to update user role' ) )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: adminKeys.users() } )
        },
    } )
}