"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDown, Check, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { GENRE_BUKU, BAHASA_BUKU } from "@/lib/constants"

function SelectFilter({
  param,
  placeholder,
  options,
}: {
  param: string
  placeholder: string
  options: readonly string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const value = searchParams.get(param) ?? ""

  const updateParam = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams)
      if (val && val !== "semua") {
        params.set(param, val)
      } else {
        params.delete(param)
      }
      params.delete("page")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [param, pathname, router, searchParams]
  )

  return (
    <Select.Root value={value || "semua"} onValueChange={updateParam}>
      <Select.Trigger
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-[var(--radius-md)] text-sm",
          "border border-[var(--border-color)] bg-[var(--bg-base)]",
          "text-[var(--text-primary)] hover:border-[var(--brand)]",
          "transition-colors duration-150 focus:outline-none",
          value && value !== "semua" && "border-[var(--brand)] text-[var(--brand)]"
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[160px] rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)] overflow-hidden"
        >
          <Select.Viewport className="p-1 max-h-60">
            <Select.Item
              value="semua"
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-sm",
                "cursor-pointer outline-none",
                "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] data-[highlighted]:bg-[var(--bg-surface)]"
              )}
            >
              <Select.ItemIndicator>
                <Check size={13} className="text-[var(--brand)]" />
              </Select.ItemIndicator>
              <Select.ItemText>Semua</Select.ItemText>
            </Select.Item>

            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-sm",
                  "cursor-pointer outline-none",
                  "text-[var(--text-primary)] hover:bg-[var(--bg-surface)] data-[highlighted]:bg-[var(--bg-surface)]"
                )}
              >
                <Select.ItemIndicator>
                  <Check size={13} className="text-[var(--brand)]" />
                </Select.ItemIndicator>
                <Select.ItemText>{opt}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export function BukuFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tersedia = searchParams.get("tersedia") === "1"

  const toggleTersedia = () => {
    const params = new URLSearchParams(searchParams)
    if (tersedia) {
      params.delete("tersedia")
    } else {
      params.set("tersedia", "1")
    }
    params.delete("page")
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
        <SlidersHorizontal size={13} />
        <span>Filter:</span>
      </div>

      <SelectFilter
        param="genre"
        placeholder="Genre"
        options={GENRE_BUKU}
      />

      <SelectFilter
        param="bahasa"
        placeholder="Bahasa"
        options={BAHASA_BUKU}
      />

      <button
        onClick={toggleTersedia}
        className={cn(
          "h-9 px-3 rounded-[var(--radius-md)] text-sm border transition-colors duration-150",
          tersedia
            ? "border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]"
            : "border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--brand)]"
        )}
      >
        Tersedia saja
      </button>
    </div>
  )
}
