import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '#/lib/auth-store'
import { Mail, Lock, AlertCircle } from 'lucide-react'

interface SigninFormData {
  email: string
  password: string
}

export function SigninPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState<SigninFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
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

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600))

    login(formData.email, formData.password)
    setIsLoading(false)
    navigate({ to: '/app' })
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-body">Sign in to your LeetTrade account</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-pressed disabled:opacity-50 text-on-primary font-medium py-2 rounded-md transition-colors mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-mute">or</span>
            </div>
          </div>

          {/* Demo Button */}
          <button
            onClick={() => {
              login('demo@leetrade.com', 'demo123')
              navigate({ to: '/app' })
            }}
            className="w-full bg-surface-elevated hover:bg-surface-card text-on-dark font-medium py-2 rounded-md border border-hairline transition-colors"
          >
            Try demo account
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-body">
            Don't have an account?{' '}
            <button
              onClick={() => navigate({ to: '/signup' })}
              className="text-on-dark hover:text-ink font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
