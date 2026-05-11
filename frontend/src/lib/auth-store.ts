import { create } from 'zustand'
import { useMe } from '#/hooks/api'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'organizer' | 'judge' | 'contestant' | 'viewer'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setRole: (role: User['role']) => void
  logout: () => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  },

  setRole: (role) => {
    const currentUser = get().user
    if (currentUser) {
      set({ user: { ...currentUser, role } })
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  initAuth: async () => {
    set({ isLoading: true })
    try {
      const query = useMe()
      const { data } = query
      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || 'User',
            role: (data.user.role as User['role']) || 'viewer',
          },
          isAuthenticated: true,
        })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))