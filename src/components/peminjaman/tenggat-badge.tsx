import { cn } from "@/lib/utils"
import { hariTersisa, isTerlambat } from "@/lib/utils"
import { AlertCircle, Clock } from "lucide-react"

export function TenggatBadge({ tenggat, status }: { tenggat: string; status: string }) {
  if (status !== "aktif" && status !== "terlambat") return null

  const terlambat = isTerlambat(tenggat)
  const sisa = hariTersisa(tenggat)

  if (terlambat) {
    const hariTerlambat = Math.abs(sisa)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--error)] bg-[var(--error-subtle)] px-2 py-0.5 rounded-full">
        <AlertCircle size={11} />
        Terlambat {hariTerlambat} hari
      </span>
    )
  }

  const isWarning = sisa <= 3

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        isWarning
          ? "text-amber-700 dark:text-amber-400 bg-[var(--warning-subtle)]"
          : "text-[var(--text-secondary)] bg-[var(--bg-surface)]"
      )}
    >
      <Clock size={11} />
      {sisa === 0 ? "Hari ini" : `${sisa} hari lagi`}
    </span>
  )
}
