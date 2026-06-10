"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { bukuSchema, type BukuInput } from "@/lib/validations/buku"
import { useUpdateBuku } from "@/hooks/use-buku"
import { GENRE_BUKU, BAHASA_BUKU } from "@/lib/constants"
import type { Buku } from "@/types"

interface Props {
  buku: Buku
  open: boolean
  onOpenChange: (v: boolean) => void
}

const selectClass =
  "h-9 w-full px-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-base)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] focus:shadow-[var(--shadow-focus)] transition-all"

export function BukuEditDialog({ buku, open, onOpenChange }: Props) {
  const { mutate: update, isPending } = useUpdateBuku()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BukuInput>({
    resolver: zodResolver(bukuSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        judul: buku.judul,
        pengarang: buku.pengarang,
        isbn: buku.isbn ?? undefined,
        penerbit: buku.penerbit ?? undefined,
        tahun_terbit: buku.tahun_terbit ?? undefined,
        genre: buku.genre,
        deskripsi: buku.deskripsi ?? undefined,
        cover_url: buku.cover_url ?? undefined,
        total_eksemplar: buku.total_eksemplar,
        tersedia: buku.tersedia,
        lokasi_rak: buku.lokasi_rak ?? undefined,
        bahasa: buku.bahasa,
        jumlah_halaman: buku.jumlah_halaman ?? undefined,
      })
    }
  }, [open, buku, reset])

  const onSubmit = (data: BukuInput) => {
    update({ id: buku.id, data }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Buku"
      description={buku.judul}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <Card>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Informasi Dasar</p>
          <div className="space-y-3">
            <Input
              label="Judul Buku *"
              error={errors.judul?.message}
              {...register("judul")}
            />
            <Input
              label="Pengarang *"
              error={errors.pengarang?.message}
              {...register("pengarang")}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="ISBN" {...register("isbn")} />
              <Input label="Penerbit" {...register("penerbit")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tahun Terbit"
                type="number"
                {...register("tahun_terbit", { valueAsNumber: true })}
              />
              <Input
                label="Jumlah Halaman"
                type="number"
                {...register("jumlah_halaman", { valueAsNumber: true })}
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Klasifikasi</p>
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Genre *</label>
              <select {...register("genre")} className={selectClass}>
                <option value="">Pilih genre</option>
                {GENRE_BUKU.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.genre && <p className="text-xs text-[var(--error)]">{errors.genre.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Bahasa</label>
              <select {...register("bahasa")} className={selectClass}>
                {BAHASA_BUKU.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <Input
              label="Lokasi Rak"
              placeholder="A-12"
              {...register("lokasi_rak")}
            />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Ketersediaan</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Eksemplar *"
              type="number"
              min={1}
              error={errors.total_eksemplar?.message}
              {...register("total_eksemplar", { valueAsNumber: true })}
            />
            <Input
              label="Tersedia"
              type="number"
              min={0}
              error={errors.tersedia?.message}
              {...register("tersedia", { valueAsNumber: true })}
            />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Deskripsi</p>
          <Textarea
            placeholder="Deskripsi singkat buku..."
            {...register("deskripsi")}
          />
        </Card>

        <Card>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Cover</p>
          <Input
            label="URL Cover"
            type="url"
            placeholder="https://..."
            error={errors.cover_url?.message}
            {...register("cover_url")}
          />
        </Card>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" className="flex-1" loading={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
