"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { m } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bell,
  BarChart3,
  RefreshCw,
  ChevronLeft,
  Library,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { sidebarVariants, sidebarTransition } from "@/lib/motion"
import { useAuth } from "@/providers/auth-provider"
import { Avatar } from "@/components/ui/avatar"
import { keluar } from "@/actions/auth"

const iconMap = {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bell,
  BarChart3,
  RefreshCw,
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", peran: ["admin", "staf", "mahasiswa"] },
  { label: "Koleksi Buku", href: "/buku", icon: "BookOpen", peran: ["admin", "staf", "mahasiswa"] },
  { label: "Peminjaman", href: "/peminjaman", icon: "BookMarked", peran: ["admin", "staf", "mahasiswa"] },
  { label: "Notifikasi", href: "/notifikasi", icon: "Bell", peran: ["admin", "staf", "mahasiswa"] },
  { label: "Analitik", href: "/analitik", icon: "BarChart3", peran: ["admin"] },
  { label: "Sinkronisasi", href: "/admin/sinkronisasi", icon: "RefreshCw", peran: ["admin"] },
] as const

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { profil, loading } = useAuth()

  const peran = profil?.peran ?? "mahasiswa"
  const filteredNav = loading
    ? navItems.filter((item) => item.peran.includes("mahasiswa" as never))
    : navItems.filter((item) => item.peran.includes(peran as never))

  return (
    <m.aside
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={sidebarTransition}
      className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-40 overflow-hidden border-r border-[var(--border-color)] bg-[var(--bg-subtle)]"
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 border-b border-[var(--border-color)]", "h-[var(--topbar-height)]")}>
        <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-[var(--radius-md)] bg-[var(--brand)] text-white">
          <Library size={16} />
        </div>
        <span
          className={cn(
            "font-semibold text-sm text-[var(--text-primary)] whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-150",
            collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
          )}
        >
          Perpustakaan
        </span>
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 px-2 space-y-0.5 overflow-y-auto transition-opacity", loading && "opacity-60")}>
        {filteredNav.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm",
                "transition-colors duration-150 group relative",
                isActive
                  ? "bg-[var(--brand-subtle)] text-[var(--brand)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-[120ms]",
                  collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <m.div
                  layoutId="sidebar-active"
                  className="absolute left-0 inset-y-0 w-0.5 rounded-full bg-[var(--brand)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {/* Tooltip saat collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-color)] shadow-[var(--shadow-md)] text-xs text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-color)] p-3 space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-[var(--radius-md)] text-sm",
            "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]",
            "transition-colors duration-150"
          )}
        >
          <m.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft size={18} />
          </m.div>
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-[120ms] text-xs",
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
            )}
          >
            Ciutkan
          </span>
        </button>

        {/* User info */}
        <div className={cn("flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]")}>
          {profil ? (
            <Avatar src={profil.avatar_url} nama={profil.nama_lengkap} size="sm" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-[var(--bg-surface)] animate-pulse shrink-0" />
          )}
          <div
            className={cn(
              "flex-1 min-w-0 overflow-hidden transition-[opacity,max-width] duration-[120ms]",
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
            )}
          >
            {profil ? (
              <>
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {profil.nama_lengkap}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">{profil.peran}</p>
              </>
            ) : (
              <div className="space-y-1">
                <div className="h-2.5 w-20 rounded bg-[var(--bg-surface)] animate-pulse" />
                <div className="h-2 w-12 rounded bg-[var(--bg-surface)] animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Sign out */}
        <form action={keluar}>
          <button
            type="submit"
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-[var(--radius-md)] text-sm",
              "text-[var(--text-secondary)] hover:bg-red-50 hover:text-[var(--error)]",
              "dark:hover:bg-[var(--error-subtle)] transition-colors duration-150"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-[120ms] text-xs",
                collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
              )}
            >
              Keluar
            </span>
          </button>
        </form>
      </div>
    </m.aside>
  )
}
