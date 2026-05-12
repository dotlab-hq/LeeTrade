import * as React from "react"

import { cn } from "@/lib/utils.ts"
import { useReducedMotion } from "@/hooks/useReducedMotion"

function Input( { className, type, style, ...props }: React.ComponentProps<"input"> ) {
  const prefersReducedMotion = useReducedMotion()
  const [isFocused, setIsFocused] = React.useState(false)

  const motionStyle: React.CSSProperties = {
    transition: prefersReducedMotion
      ? 'none'
      : 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      style={motionStyle}
      onFocus={(e) => {
        setIsFocused(true)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        setIsFocused(false)
        props.onBlur?.(e)
      }}
      {...props}
    />
  )
}

export { Input }
