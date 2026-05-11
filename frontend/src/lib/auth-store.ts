import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  role: 'contestant' | 'organizer' | 'judge' | 'viewer'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  signup: (email: string, password: string, name: string) => void
  logout: () => void
  setRole: (role: User['role']) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, password: string) => {
    // Mock login - creates a user session
    const mockUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name: email.split('@')[0],
      role: 'contestant',
    }
    set({ user: mockUser, isAuthenticated: true })
  },

  signup: (email: string, password: string, name: string) => {
    const mockUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role: 'contestant',
    }
    set({ user: mockUser, isAuthenticated: true })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  setRole: (role: User['role']) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    }))
  },
}))
