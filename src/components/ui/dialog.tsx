"use client"

import * as RadixDialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { dialogVariants, overlayVariants } from "@/lib/motion"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  /** Kelas tambahan untuk container luar (ukuran, dll) */
  className?: string
  /** Kelas tambahan untuk area konten yang bisa di-scroll */
  contentClassName?: string
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div
                variants={overlayVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content asChild>
              <motion.div
                variants={dialogVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
                  "w-full max-w-md max-h-[90vh]",
                  "flex flex-col",
                  "bg-[var(--bg-base)] rounded-[var(--radius-xl)]",
                  "border border-[var(--border-color)] shadow-[var(--shadow-lg)]",
                  className
                )}
              >
                {/* Header — tidak ikut scroll */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
                  <div>
                    {title && (
                      <RadixDialog.Title className="text-base font-semibold text-[var(--text-primary)]">
                        {title}
                      </RadixDialog.Title>
                    )}
                    {description && (
                      <RadixDialog.Description className="mt-1 text-sm text-[var(--text-secondary)]">
                        {description}
                      </RadixDialog.Description>
                    )}
                  </div>
                  <RadixDialog.Close className="rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors shrink-0 ml-4">
                    <X size={16} />
                  </RadixDialog.Close>
                </div>

                {/* Konten — area yang scroll */}
                <div className={cn("overflow-y-auto flex-1 min-h-0 px-6 pb-6", contentClassName)}>
                  {children}
                </div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
