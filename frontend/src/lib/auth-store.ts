import { create } from 'zustand'

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
  initAuth: (sessionData: any) => void
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

  initAuth: (sessionData) => {
    try {
      if (sessionData?.user) {
        set({
          user: {
            id: sessionData.user.id,
            email: sessionData.user.email,
            name: sessionData.user.name || 'User',
            role: (sessionData.user.role as User['role']) || 'viewer',
          },
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
