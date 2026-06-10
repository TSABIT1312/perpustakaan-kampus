"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { bukuSchema, type BukuInput } from "@/lib/validations/buku"
import { useCreateBuku } from "@/hooks/use-buku"
import { GENRE_BUKU, BAHASA_BUKU } from "@/lib/constants"
import { Card } from "@/components/ui/card"

export function BukuForm() {
  const router = useRouter()
  const { mutate, isPending } = useCreateBuku()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BukuInput>({
    resolver: zodResolver(bukuSchema),
    defaultValues: {
      total_eksemplar: 1,
      tersedia: 1,
      bahasa: "Indonesia",
    },
  })

  const onSubmit = (data: BukuInput) => {
    mutate(data, {
      onSuccess: () => router.push("/buku"),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Card>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Informasi Dasar</p>
        <div className="space-y-4">
          <Input
            label="Judul Buku *"
            placeholder="Judul lengkap buku"
            error={errors.judul?.message}
            {...register("judul")}
          />
          <Input
            label="Pengarang *"
            placeholder="Nama pengarang"
            error={errors.pengarang?.message}
            {...register("pengarang")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ISBN"
              placeholder="978-xxx-xxx-xxx"
              error={errors.isbn?.message}
              {...register("isbn")}
            />
            <Input
              label="Penerbit"
              placeholder="Nama penerbit"
              error={errors.penerbit?.message}
              {...register("penerbit")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tahun Terbit"
              type="number"
              placeholder="2024"
              error={errors.tahun_terbit?.message}
              {...register("tahun_terbit", { valueAsNumber: true })}
            />
            <Input
              label="Jumlah Halaman"
              type="number"
              placeholder="250"
              error={errors.jumlah_halaman?.message}
              {...register("jumlah_halaman", { valueAsNumber: true })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Klasifikasi</p>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Genre *</label>
            <select
              {...register("genre")}
              className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-base)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] focus:shadow-[var(--shadow-focus)] transition-all"
            >
              <option value="">Pilih genre</option>
              {GENRE_BUKU.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.genre && <p className="text-xs text-[var(--error)]">{errors.genre.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Bahasa</label>
            <select
              {...register("bahasa")}
              className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-base)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] focus:shadow-[var(--shadow-focus)] transition-all"
            >
              {BAHASA_BUKU.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <Input
            label="Lokasi Rak"
            placeholder="A-12"
            hint="Kode lokasi rak buku di perpustakaan"
            {...register("lokasi_rak")}
          />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Ketersediaan</p>
        <div className="grid grid-cols-2 gap-4">
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
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Deskripsi</p>
        <Textarea
          placeholder="Deskripsi singkat tentang buku ini..."
          {...register("deskripsi")}
        />
      </Card>

      <Card>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Cover</p>
        <Input
          label="URL Cover"
          type="url"
          placeholder="https://..."
          hint="URL gambar cover buku (opsional)"
          error={errors.cover_url?.message}
          {...register("cover_url")}
        />
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => router.back()}
        >
          Batal
        </Button>
        <Button type="submit" className="flex-1" loading={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Buku"}
        </Button>
      </div>
    </form>
  )
}
