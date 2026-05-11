import { useUiStore } from '@/stores/ui-store.ts'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils.ts'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'text-accent-green',
  error: 'text-accent-red',
  info: 'text-accent-blue',
}

export function ToastStack() {
  const { toasts, dismissToast } = useUiStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.tone]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-hairline bg-surface-card p-4 shadow-lg',
              'animate-in slide-in-from-right-full fade-in-0 duration-300'
            )}
          >
            <Icon className={cn('size-5 mt-0.5 shrink-0', colorMap[toast.tone])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              <p className="text-xs text-body mt-0.5">{toast.description}</p>
            </div>
            <button onClick={() => dismissToast(toast.id)} className="shrink-0 text-mute hover:text-ink">
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
