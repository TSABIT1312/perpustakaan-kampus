"use client"

import { Bell, BookOpen, AlertTriangle, RotateCcw, Info, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatWaktuRelatif } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTandaiDibaca, useTandaiSemuaDibaca } from "@/hooks/use-notifikasi"
import type { Notifikasi } from "@/types"

const tipeIcon = {
  segera_tenggat: { icon: AlertTriangle, color: "text-[var(--warning)]", bg: "bg-[var(--warning-subtle)]" },
  terlambat: { icon: AlertTriangle, color: "text-[var(--error)]", bg: "bg-[var(--error-subtle)]" },
  dikembalikan: { icon: RotateCcw, color: "text-[var(--success)]", bg: "bg-[var(--success-subtle)]" },
  buku_tersedia: { icon: BookOpen, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
  sistem: { icon: Info, color: "text-[var(--info)]", bg: "bg-[var(--info-subtle)]" },
  buku_baru: { icon: BookOpen, color: "text-[var(--brand)]", bg: "bg-[var(--brand-subtle)]" },
}

export function NotifikasiList({ notifikasi }: { notifikasi: Notifikasi[] }) {
  const { mutate: tandaiSatu } = useTandaiDibaca()
  const { mutate: tandaiSemua, isPending } = useTandaiSemuaDibaca()

  const belumDibaca = notifikasi.filter((n) => !n.dibaca).length

  if (notifikasi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4">
          <Bell size={24} className="text-[var(--text-tertiary)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Tidak ada notifikasi</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          Kamu sudah membaca semua notifikasi
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {belumDibaca > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => tandaiSemua()}
            loading={isPending}
          >
            <CheckCheck size={14} />
            Tandai semua dibaca ({belumDibaca})
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {notifikasi.map((notif) => {
          const config = tipeIcon[notif.tipe] ?? tipeIcon.sistem
          const Icon = config.icon

          return (
            <div
              key={notif.id}
              onClick={() => !notif.dibaca && tandaiSatu(notif.id)}
              className={cn(
                "flex gap-3 p-4 rounded-[var(--radius-lg)] border transition-colors cursor-pointer",
                notif.dibaca
                  ? "border-[var(--border-color)] bg-[var(--bg-base)] opacity-70"
                  : "border-[var(--border-color)] bg-[var(--bg-base)] hover:border-[var(--border-strong)]"
              )}
            >
              <div className={cn("p-2 rounded-[var(--radius-md)] h-fit shrink-0", config.bg)}>
                <Icon size={14} className={config.color} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-medium", notif.dibaca ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]")}>
                    {notif.judul}
                  </p>
                  {!notif.dibaca && (
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{notif.pesan}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                  {formatWaktuRelatif(notif.created_at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
