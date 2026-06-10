"use client"

import { useState, useTransition } from "react"
import { RefreshCw, CheckCircle2, AlertCircle, Users, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { syncMahasiswaSipro, type SyncResult } from "@/actions/sync-sipro"
import { cn } from "@/lib/utils"

export function SyncSiproPanel({ jumlahSipro }: { jumlahSipro: number }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSync() {
    setError(null)
    setResult(null)
    startTransition(async () => {
      try {
        const res = await syncMahasiswaSipro()
        setResult(res)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Status sipro */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--brand-subtle)]">
            <Users size={16} className="text-[var(--brand)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Sistem Informasi Prodi (Sipro)</p>
            <p className="text-xs text-[var(--text-tertiary)]">Database mahasiswa terhubung</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-xs text-[var(--success)] font-medium">Terhubung</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] bg-[var(--bg-base)] border border-[var(--border-color)] p-3 text-center">
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{jumlahSipro}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Mahasiswa di Sipro</p>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[var(--bg-base)] border border-[var(--border-color)] p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Format akun</p>
            <p className="text-xs font-mono text-[var(--brand)]">NIM@mahasiswa.perpus.id</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Sandi: tanggal lahir (YYYYMMDD)</p>
          </div>
        </div>
      </div>

      {/* Alur sinkronisasi */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
        <span className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)]">Sipro DB</span>
        <ArrowRight size={14} />
        <span className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)]">Buat Akun Auth</span>
        <ArrowRight size={14} />
        <span className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)]">Profil Mahasiswa</span>
      </div>

      {/* Tombol sinkronisasi */}
      <button
        onClick={handleSync}
        disabled={isPending}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all",
          "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <RefreshCw size={15} className={cn(isPending && "animate-spin")} />
        {isPending ? "Sedang menyinkronkan..." : "Sinkronkan Sekarang"}
      </button>

      {/* Hasil */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[var(--radius-lg)] border border-[var(--success)] bg-[var(--success-subtle)] p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-[var(--success)]" />
              <p className="text-sm font-medium text-[var(--success)]">Sinkronisasi selesai</p>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Total", value: result.total, color: "text-[var(--text-primary)]" },
                { label: "Berhasil", value: result.berhasil, color: "text-[var(--success)]" },
                { label: "Dilewati", value: result.dilewati, color: "text-[var(--text-secondary)]" },
                { label: "Gagal", value: result.gagal, color: "text-[var(--error)]" },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--radius-sm)] bg-[var(--bg-base)] p-2">
                  <p className={cn("text-xl font-semibold", item.color)}>{item.value}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[var(--radius-lg)] border border-[var(--error)] bg-[var(--error-subtle)] p-4 flex items-start gap-2"
          >
            <AlertCircle size={16} className="text-[var(--error)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--error)]">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
