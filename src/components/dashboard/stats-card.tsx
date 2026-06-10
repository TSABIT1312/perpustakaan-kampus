"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { BookOpen, BookMarked, Users, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { fadeUp } from "@/lib/motion"

const iconMap = {
  BookOpen,
  BookMarked,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
}

type IconName = keyof typeof iconMap

interface StatsCardProps {
  label: string
  value: number
  icon: IconName
  color: "brand" | "success" | "warning" | "error"
  trend?: { value: number; label: string }
  prefix?: string
  suffix?: string
}

const colorMap = {
  brand: {
    bg: "bg-[var(--brand-subtle)]",
    text: "text-[var(--brand)]",
    icon: "text-[var(--brand)]",
  },
  success: {
    bg: "bg-[var(--success-subtle)]",
    text: "text-[var(--success)]",
    icon: "text-[var(--success)]",
  },
  warning: {
    bg: "bg-[var(--warning-subtle)]",
    text: "text-amber-700 dark:text-amber-400",
    icon: "text-[var(--warning)]",
  },
  error: {
    bg: "bg-[var(--error-subtle)]",
    text: "text-[var(--error)]",
    icon: "text-[var(--error)]",
  },
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 })
  const ref = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(0)

  useEffect(() => {
    motionValue.set(prevValue.current)
    spring.set(value)
    prevValue.current = value
  }, [value, motionValue, spring])

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString("id-ID")
    })
    return unsubscribe
  }, [spring])

  return <span ref={ref}>0</span>
}

export function StatsCard({
  label,
  value,
  icon,
  color,
  trend,
  prefix,
  suffix,
}: StatsCardProps) {
  const colors = colorMap[color]
  const Icon = iconMap[icon]

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-base)] p-5 shadow-[var(--shadow-sm)] cursor-default"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <div className={cn("p-2 rounded-[var(--radius-md)]", colors.bg)}>
          <Icon size={16} className={colors.icon} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        {prefix && <span className="text-sm text-[var(--text-secondary)]">{prefix}</span>}
        <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          <AnimatedNumber value={value} />
        </span>
        {suffix && <span className="text-sm text-[var(--text-secondary)]">{suffix}</span>}
      </div>

      {trend && (
        <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">
          <span
            className={cn(
              "font-medium",
              trend.value > 0 ? "text-[var(--success)]" : "text-[var(--error)]"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>{" "}
          {trend.label}
        </p>
      )}
    </motion.div>
  )
}
