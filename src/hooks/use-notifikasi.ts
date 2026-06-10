"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getNotifikasi,
  getJumlahBelumDibaca,
  tandaiDibaca,
  tandaiSemuaDibaca,
} from "@/actions/notifikasi"

export function useNotifikasi() {
  return useQuery({
    queryKey: ["notifikasi"],
    queryFn: getNotifikasi,
    refetchInterval: 30_000,
  })
}

export function useNotifBelumDibaca() {
  return useQuery({
    queryKey: ["notifikasi", "unread-count"],
    queryFn: getJumlahBelumDibaca,
    refetchInterval: 30_000,
  })
}

export function useTandaiDibaca() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tandaiDibaca(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifikasi"] })
    },
  })
}

export function useTandaiSemuaDibaca() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tandaiSemuaDibaca,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifikasi"] })
      toast.success("Semua notifikasi ditandai dibaca")
    },
  })
}
