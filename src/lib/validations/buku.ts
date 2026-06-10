import { z } from "zod"

export const bukuSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  pengarang: z.string().min(1, "Pengarang wajib diisi"),
  isbn: z.string().optional().nullable(),
  penerbit: z.string().optional().nullable(),
  tahun_terbit: z.number().int().min(1000).max(2100).optional().nullable(),
  genre: z.string().min(1, "Genre wajib dipilih"),
  deskripsi: z.string().optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
  total_eksemplar: z.number().int().min(1, "Minimal 1 eksemplar"),
  tersedia: z.number().int().min(0),
  lokasi_rak: z.string().optional().nullable(),
  bahasa: z.string().min(1, "Bahasa wajib diisi"),
  jumlah_halaman: z.number().int().min(1).optional().nullable(),
})

export type BukuInput = z.infer<typeof bukuSchema>
