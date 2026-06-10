"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPeminjaman, pinjamBuku, kembalikanBuku, ajukanPengembalian } from "@/actions/peminjaman"
import type { FilterPeminjaman } from "@/types"

export function usePeminjaman(filter: FilterPeminjaman = {}) {
  return useQuery({
    queryKey: ["peminjaman", filter],
    queryFn: () => getPeminjaman(filter),
  })
}

export function usePinjamBuku() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bukuId: string) => pinjamBuku(bukuId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["peminjaman"] })
      qc.invalidateQueries({ queryKey: ["buku"] })
      toast.success("Buku berhasil dipinjam! Tenggat 14 hari.")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useKembalikanBuku() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan?: string }) =>
      kembalikanBuku(id, catatan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["peminjaman"] })
      qc.invalidateQueries({ queryKey: ["buku"] })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Buku berhasil dikembalikan")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useAjukanPengembalian() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ajukanPengembalian(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["peminjaman"] })
      qc.invalidateQueries({ queryKey: ["buku"] })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Pengembalian berhasil dicatat. Pastikan buku sudah dikembalikan ke rak.")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
