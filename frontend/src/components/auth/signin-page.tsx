import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSignIn } from '#/hooks/api'
import { useAuthStore } from '#/lib/auth-store'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export function SigninPage() {
  const navigate = useNavigate()
  const signInMutation = useSignIn()
  const setUser = useAuthStore((s) => s.setUser)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const result = await signInMutation.mutateAsync(formData)
      setUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || 'User',
        role: result.user.role || 'contestant',
      })
      navigate({ to: '/app' })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign in failed' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-body">Sign in to your LeetTrade account</p>
        </div>

        <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-3 bg-accent-red-soft border border-accent-red rounded-md flex items-center gap-2 text-accent-red text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.form}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${
                    errors.email ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 bg-surface-elevated border rounded-md text-on-dark placeholder-mute outline-none transition-colors ${
                    errors.password ? 'border-accent-red' : 'border-hairline focus:border-hairline-strong'
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

            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full bg-primary hover:bg-primary-pressed disabled:opacity-50 text-on-primary font-medium py-2 rounded-md transition-colors mt-6"
            >
              {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-body">
            Don't have an account?{' '}
            <button onClick={() => navigate({ to: '/signup' })} className="text-on-dark hover:text-ink font-medium">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}