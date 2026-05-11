import { useMutation } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { signUpSchema  } from '@/hooks/schemas'
import type {SignUpInput} from '@/hooks/schemas';

export function useSignUp() {
    return useMutation( {
        mutationFn: async ( input: SignUpInput ) => {
            const parsed = signUpSchema.safeParse( input )
            if ( !parsed.success ) throw new Error( parsed.error.issues[0].message )

            try {
                const response = await api.post( '/api/auth/sign-up/email', {
                    name: input.name,
                    email: input.email,
                    password: input.password,
                } )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Sign up failed' ) )
            }
        },
    } )
}