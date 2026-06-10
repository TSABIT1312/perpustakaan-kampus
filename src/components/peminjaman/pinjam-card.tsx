"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { BookOpen, RotateCcw, AlertTriangle } from "lucide-react"
import { formatTanggalPendek, formatRupiah } from "@/lib/utils"
import { StatusBadge } from "@/components/ui/badge"
import { TenggatBadge } from "./tenggat-badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useKembalikanBuku, useAjukanPengembalian } from "@/hooks/use-peminjaman"
import { useAuth } from "@/providers/auth-provider"
import type { Peminjaman } from "@/types"

export function PinjamCard({ peminjaman }: { peminjaman: Peminjaman }) {
  const [konfirmOpen, setKonfirmOpen] = useState(false)
  const { mutate: kembalikanStaf, isPending: pendingStaf } = useKembalikanBuku()
  const { mutate: ajukanKembali, isPending: pendingMahasiswa } = useAjukanPengembalian()
  const { profil } = useAuth()

  const isStaff = profil?.peran === "admin" || profil?.peran === "staf"
  const isMahasiswa = profil?.peran === "mahasiswa"
  const buku = peminjaman.buku
  const aktif = peminjaman.status === "aktif" || peminjaman.status === "terlambat"
  const terlambat = peminjaman.status === "terlambat"

  return (
    <>
      <div className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-base)] hover:border-[var(--border-strong)] transition-colors">
        {/* Cover */}
        <Link href={`/buku/${peminjaman.buku_id}`} className="shrink-0">
          <div className="h-20 w-14 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-surface)]">
            {buku?.cover_url ? (
              <Image
                src={buku.cover_url}
                alt={buku.judul}
                width={56}
                height={80}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[var(--brand-subtle)]">
                <BookOpen size={20} className="text-[var(--brand)]" />
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/buku/${peminjaman.buku_id}`}>
                <p className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors truncate">
                  {buku?.judul ?? "–"}
                </p>
              </Link>
              <p className="text-xs text-[var(--text-tertiary)]">{buku?.pengarang}</p>
            </div>
            <StatusBadge status={peminjaman.status} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs text-[var(--text-tertiary)]">
              Dipinjam {formatTanggalPendek(peminjaman.dipinjam_pada)}
            </span>
            <TenggatBadge tenggat={peminjaman.tenggat} status={peminjaman.status} />
          </div>

          {peminjaman.denda > 0 && (
            <p className="mt-1.5 text-xs font-medium text-[var(--error)]">
              Denda: {formatRupiah(peminjaman.denda)}
            </p>
          )}
        </div>

        {/* Tombol kembalikan */}
        {aktif && (isStaff || isMahasiswa) && (
          <Button
            variant={terlambat ? "danger" : "secondary"}
            size="sm"
            onClick={() => setKonfirmOpen(true)}
            className="shrink-0"
          >
            <RotateCcw size={13} />
            Kembalikan
          </Button>
        )}
      </div>

      {/* Dialog konfirmasi staf */}
      {isStaff && (
        <Dialog
          open={konfirmOpen}
          onOpenChange={setKonfirmOpen}
          title="Konfirmasi Pengembalian"
          description={`Kembalikan "${buku?.judul}" atas nama ${peminjaman.peminjam?.nama_lengkap ?? "peminjam"}?`}
        >
          <div className="flex gap-2 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setKonfirmOpen(false)}>
              Batal
            </Button>
            <Button
              className="flex-1"
              loading={pendingStaf}
              onClick={() =>
                kembalikanStaf({ id: peminjaman.id }, { onSuccess: () => setKonfirmOpen(false) })
              }
            >
              Konfirmasi
            </Button>
          </div>
        </Dialog>
      )}

      {/* Dialog konfirmasi mahasiswa */}
      {isMahasiswa && (
        <Dialog
          open={konfirmOpen}
          onOpenChange={setKonfirmOpen}
          title="Kembalikan Buku"
          description={`"${buku?.judul}"`}
        >
          <div className="mt-1 mb-4 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Pastikan buku sudah secara fisik dikembalikan ke rak atau diserahkan ke petugas perpustakaan sebelum menekan tombol ini.
            </p>
          </div>

          {terlambat && (
            <div className="mb-4 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[var(--error-subtle)] border border-red-200 dark:border-red-800 px-3 py-2.5">
              <AlertTriangle size={15} className="text-[var(--error)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--error)] leading-relaxed">
                Buku ini terlambat dikembalikan. Hubungi petugas perpustakaan untuk informasi denda.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setKonfirmOpen(false)}
              disabled={pendingMahasiswa}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              loading={pendingMahasiswa}
              onClick={() =>
                ajukanKembali(peminjaman.id, { onSuccess: () => setKonfirmOpen(false) })
              }
            >
              Sudah Dikembalikan
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}
