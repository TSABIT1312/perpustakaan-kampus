import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]",
  success:
    "bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success)]/20",
  warning:
    "bg-[var(--warning-subtle)] text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  error:
    "bg-[var(--error-subtle)] text-[var(--error)] border border-[var(--error)]/20",
  info:
    "bg-[var(--info-subtle)] text-[var(--info)] border border-[var(--info)]/20",
  outline:
    "bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)]",
}

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-tertiary)]",
  success: "bg-[var(--success)]",
  warning: "bg-amber-500",
  error: "bg-[var(--error)]",
  info: "bg-[var(--info)]",
  outline: "bg-[var(--text-tertiary)]",
}

export function Badge({ variant = "default", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    aktif: { label: "Aktif", variant: "info" },
    dikembalikan: { label: "Dikembalikan", variant: "success" },
    terlambat: { label: "Terlambat", variant: "error" },
    hilang: { label: "Hilang", variant: "error" },
    tersedia: { label: "Tersedia", variant: "success" },
    dipinjam: { label: "Dipinjam", variant: "warning" },
  }

  const config = map[status] || { label: status, variant: "default" as BadgeVariant }

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  )
}
