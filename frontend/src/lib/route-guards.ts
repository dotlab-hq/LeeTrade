import { redirect } from '@tanstack/react-router'
import { api } from '#/hooks/api/http'
import { useAuthStore } from '#/lib/auth-store'

import type { SessionResponse } from '#/hooks/schemas'

type UserRole = 'admin' | 'organizer' | 'judge' | 'contestant' | 'viewer'

type AppUser = {
    id: string
    email: string
    name: string
    role: UserRole
}

function toAppUser( session: SessionResponse ): AppUser {
    return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || 'User',
        role: ( session.user.role as UserRole ) || 'viewer',
    }
}

export async function requireAuth(): Promise<AppUser> {
    const authState = useAuthStore.getState()

    if ( authState.isAuthenticated && authState.user ) {
        return authState.user
    }

    try {
        const response = await api.get<SessionResponse>( '/api/v1/auth/me' )
        const user = toAppUser( response.data )
        useAuthStore.getState().setUser( user )
        return user
    } catch {
        useAuthStore.getState().logout()
        throw redirect( { to: '/signin' } )
    }
}

export async function requireRole( allowedRoles: UserRole[] ): Promise<AppUser> {
    const user = await requireAuth()

    if ( !allowedRoles.includes( user.role ) ) {
        throw redirect( { to: '/app' } )
    }

    return user
}
