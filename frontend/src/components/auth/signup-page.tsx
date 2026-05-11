import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSignUp } from '#/hooks/api'
import { useAuthStore } from '#/lib/auth-store'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupPage() {
  const navigate = useNavigate()
  const signUpMutation = useSignUp()
  const setUser = useAuthStore( ( s ) => s.setUser )
  const [formData, setFormData] = useState<SignupFormData>( {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  } )
  const [errors, setErrors] = useState<Record<string, string>>( {} )

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if ( !formData.name.trim() ) newErrors.name = 'Name is required'
    if ( !formData.email.trim() ) newErrors.email = 'Email is required'
    else if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( formData.email ) )
      newErrors.email = 'Invalid email format'

    if ( !formData.password ) newErrors.password = 'Password is required'
    else if ( formData.password.length < 8 )
      newErrors.password = 'Password must be at least 8 characters'

    if ( formData.password !== formData.confirmPassword )
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors( newErrors )
    return Object.keys( newErrors ).length === 0
  }

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault()
    if ( !validateForm() ) return

    try {
      const result = await signUpMutation.mutateAsync( {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      } )
      setUser( {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || 'User',
        role: result.user.role || 'contestant',
      } )
      navigate( { to: '/app' } )
    } catch ( err ) {
      setErrors( { form: err instanceof Error ? err.message : 'Sign up failed' } )
    }
  }

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, value } = e.target
    setFormData( ( prev ) => ( { ...prev, [name]: value } ) )
    if ( errors[name] ) {
      setErrors( ( prev ) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      } )
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-ink mb-2">Create account</h1>
          <p className="text-body">Join LeetTrade to start trading</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-3 bg-accent-red-soft border border-accent-red rounded-md flex items-center gap-2 text-accent-red text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.form}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${errors.name ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
                    }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-accent-red flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${errors.email ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-accent-red flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${errors.password ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
                    }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-accent-red flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${errors.confirmPassword ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
                    }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-accent-red flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full bg-primary hover:bg-primary-pressed disabled:opacity-50 text-on-primary font-medium py-2 rounded-md transition-colors mt-6"
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-body">
            Already have an account?{' '}
            <button
              onClick={() => navigate( { to: '/signin' } )}
              className="text-on-dark hover:text-ink font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
