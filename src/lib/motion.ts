import type { Variants, Transition } from "framer-motion"

const ease = [0.4, 0, 0.2, 1] as const

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease } },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18, ease } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
}

export const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
}

export const staggerFast: Variants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
}

export const listItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease } },
}

export const cardHoverTransition: Transition = {
  duration: 0.18,
  ease,
}

export const dialogVariants: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.15 },
  },
}

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
}

export const sidebarTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 60, scale: 0.92 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.18 } },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease, when: "beforeChildren" },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}
