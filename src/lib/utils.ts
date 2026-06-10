import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, differenceInDays } from "date-fns"
import { id } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTanggal(date: string | Date, fmt = "d MMMM yyyy") {
  return format(new Date(date), fmt, { locale: id })
}

export function formatTanggalPendek(date: string | Date) {
  return format(new Date(date), "d MMM yyyy", { locale: id })
}

export function formatWaktuRelatif(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function isTerlambat(dueDate: string | Date) {
  return isAfter(new Date(), new Date(dueDate))
}

export function hariTersisa(dueDate: string | Date) {
  return differenceInDays(new Date(dueDate), new Date())
}

export function singkat(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "…"
}

export function generateInisial(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}
