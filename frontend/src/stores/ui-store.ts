import { create } from 'zustand'

export type UserRole = 'contestant' | 'organizer' | 'admin' | 'viewer'
type ToastTone = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  title: string
  description: string
  tone: ToastTone
}

type ConfirmState = {
  open: boolean
  title: string
  description: string
  onConfirmToast: string
}

type UiState = {
  role: UserRole
  isMobileNavOpen: boolean
  isCommandOpen: boolean
  confirm: ConfirmState
  toasts: ToastItem[]
  sidebarCollapsed: boolean
  setRole: (role: UserRole) => void
  setMobileNavOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  toggleSidebar: () => void
  openConfirm: (title: string, description: string, onConfirmToast: string) => void
  closeConfirm: () => void
  confirmNow: () => void
  pushToast: (title: string, description: string, tone?: ToastTone) => void
  dismissToast: (id: string) => void
  pushDummyToast: (action: string) => void
}

const initialConfirm: ConfirmState = {
  open: false,
  title: '',
  description: '',
  onConfirmToast: '',
}

export const useUiStore = create<UiState>((set, get) => ({
  role: 'contestant',
  isMobileNavOpen: false,
  isCommandOpen: false,
  confirm: initialConfirm,
  toasts: [],
  sidebarCollapsed: false,
  setRole: (role) => set({ role }),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openConfirm: (title, description, onConfirmToast) =>
    set({ confirm: { open: true, title, description, onConfirmToast } }),
  closeConfirm: () => set({ confirm: initialConfirm }),
  confirmNow: () => {
    const { confirm, pushDummyToast } = get()
    if (!confirm.onConfirmToast) return
    pushDummyToast(confirm.onConfirmToast)
    set({ confirm: initialConfirm })
  },
  pushToast: (title, description, tone = 'info') =>
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-4),
        { id: `${Date.now()}-${Math.random()}`, title, description, tone },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  pushDummyToast: (action) =>
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-4),
        {
          id: `${Date.now()}-${Math.random()}`,
          title: `${action} completed`,
          description: 'Dummy action executed. API integration is intentionally disabled.',
          tone: 'success',
        },
      ],
    })),
}))
