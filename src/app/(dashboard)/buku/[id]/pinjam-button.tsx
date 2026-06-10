"use client"

import { useState } from "react"
import { BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { usePinjamBuku } from "@/hooks/use-peminjaman"
import { formatTanggal } from "@/lib/utils"
import { addDays } from "date-fns"
import { MAKS_HARI_PINJAM } from "@/lib/constants"

interface PinjamButtonProps {
  bukuId: string
  tersedia: boolean
}

export function PinjamButton({ bukuId, tersedia }: PinjamButtonProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = usePinjamBuku()

  const tenggat = formatTanggal(addDays(new Date(), MAKS_HARI_PINJAM))

  const handlePinjam = () => {
    mutate(bukuId, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <>
      <Button
        className="w-full"
        disabled={!tersedia}
        onClick={() => setOpen(true)}
      >
        <BookMarked size={15} />
        {tersedia ? "Pinjam Buku" : "Tidak Tersedia"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Konfirmasi Peminjaman"
        description="Pastikan kamu siap bertanggung jawab atas buku yang dipinjam."
      >
        <div className="space-y-4">
          <div className="rounded-[var(--radius-md)] bg-[var(--bg-surface)] p-3">
            <p className="text-xs text-[var(--text-tertiary)]">Tenggat pengembalian</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{tenggat}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Keterlambatan dikenakan denda Rp 1.000/hari
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              loading={isPending}
              onClick={handlePinjam}
            >
              Ya, Pinjam
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
