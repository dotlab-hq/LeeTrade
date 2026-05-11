import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { signInSchema, type SignInInput } from '@/hooks/schemas'

export function useSignIn() {
    return useMutation( {
        mutationFn: async ( input: SignInInput ) => {
            const parsed = signInSchema.safeParse( input )
            if ( !parsed.success ) throw new Error( parsed.error.errors[0].message )

            try {
                const response = await api.post( '/api/auth/sign-in/email', {
                    email: input.email,
                    password: input.password,
                } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Sign in failed' ) )
            }
        },
    } )
}