import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, hint, className, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-[var(--border-color)]",
            "bg-[var(--bg-base)] text-sm text-[var(--text-primary)]",
            "placeholder:text-[var(--text-tertiary)]",
            "px-3 py-2 min-h-[100px] resize-y",
            "transition-all duration-150",
            "focus:outline-none focus:border-[var(--brand)] focus:shadow-[var(--shadow-focus)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[var(--error)]",
            className
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea"
