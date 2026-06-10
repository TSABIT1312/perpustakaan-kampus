"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/providers/auth-provider"
import { useNotifBelumDibaca } from "@/hooks/use-notifikasi"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/buku": "Koleksi Buku",
  "/peminjaman": "Peminjaman",
  "/peminjaman/riwayat": "Riwayat Peminjaman",
  "/notifikasi": "Notifikasi",
  "/analitik": "Analitik",
}

export function Topbar() {
  const pathname = usePathname()
  const { profil } = useAuth()
  const { data: jumlahBelumDibaca = 0 } = useNotifBelumDibaca()

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] || "Perpustakaan"

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-6",
        "h-[var(--topbar-height)] border-b border-[var(--border-color)]",
        "bg-[var(--bg-base)]/80 backdrop-blur-md"
      )}
    >
      {/* Page Title */}
      <h1 className="text-sm font-semibold text-[var(--text-primary)]">
        {pageTitle}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Search placeholder */}
        <button className="hidden md:flex items-center gap-2 h-8 px-3 rounded-[var(--radius-md)] text-xs text-[var(--text-tertiary)] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand)] transition-colors mr-2">
          <Search size={13} />
          <span>Cari buku...</span>
          <kbd className="ml-1 px-1 rounded text-[10px] border border-[var(--border-color)] bg-[var(--bg-base)] font-mono">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        {/* Notification bell */}
        <Link
          href="/notifikasi"
          className="relative h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
        >
          <Bell size={16} />
          {jumlahBelumDibaca > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--error)] ring-2 ring-[var(--bg-base)]" />
          )}
        </Link>

        {/* User avatar */}
        {profil && (
          <Link href="/profil" className="ml-1">
            <Avatar
              src={profil.avatar_url}
              nama={profil.nama_lengkap}
              size="sm"
              className="hover:ring-2 hover:ring-[var(--brand)] transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
