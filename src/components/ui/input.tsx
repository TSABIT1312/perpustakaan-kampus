import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-tertiary)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-[var(--radius-md)] border border-[var(--border-color)]",
              "bg-[var(--bg-base)] text-sm text-[var(--text-primary)]",
              "placeholder:text-[var(--text-tertiary)]",
              "px-3 py-2 h-9",
              "transition-all duration-150",
              "focus:outline-none focus:border-[var(--brand)] focus:shadow-[var(--shadow-focus)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--text-tertiary)]">
              {rightIcon}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-[var(--error)]" : "text-[var(--text-tertiary)]"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
