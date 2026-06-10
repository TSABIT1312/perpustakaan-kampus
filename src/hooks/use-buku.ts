"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getBuku, getBukuById, createBuku, updateBuku, deleteBuku } from "@/actions/buku"
import type { FilterBuku } from "@/types"

export function useBuku(filter: FilterBuku = {}) {
  return useQuery({
    queryKey: ["buku", filter],
    queryFn: () => getBuku(filter),
  })
}

export function useBukuById(id: string) {
  return useQuery({
    queryKey: ["buku", id],
    queryFn: () => getBukuById(id),
    enabled: !!id,
  })
}

export function useCreateBuku() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => createBuku(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["buku"] })
      toast.success("Buku berhasil ditambahkan")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateBuku() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateBuku(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["buku"] })
      toast.success("Buku berhasil diperbarui")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteBuku() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBuku(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["buku"] })
      toast.success("Buku berhasil dihapus")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
