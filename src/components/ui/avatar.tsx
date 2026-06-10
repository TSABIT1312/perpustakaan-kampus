import * as RadixAvatar from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { generateInisial } from "@/lib/utils"

interface AvatarProps {
  src?: string | null
  nama: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeStyles = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
}

export function Avatar({ src, nama, size = "md", className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeStyles[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src ?? undefined}
        alt={nama}
        className="aspect-square h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center",
          "bg-[var(--brand-subtle)] text-[var(--brand)] font-semibold"
        )}
      >
        {generateInisial(nama)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
