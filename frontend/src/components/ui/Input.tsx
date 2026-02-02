import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm',
            'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-fg)]',
            'placeholder:text-[var(--color-muted)]',
            'focus:outline-none focus:border-[var(--color-accent)]',
            'hover:border-[var(--color-border-hover)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-error)]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-sm text-[var(--color-error)]">{error}</span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
