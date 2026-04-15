import type { LucideIcon } from 'lucide-react'
import { Wrench, Sun, Zap, HardHat, Car, Scissors } from 'lucide-react'
import { type SkillName } from './learning-constants'

/**
 * Shared visual metadata for each skill category.
 * Used by the landing page, learner dashboard, and any future skill display.
 *
 * `Icon` is the Lucide component reference — consumers render it with their
 * own className for sizing (e.g. `<Icon className="w-8 h-8" />`).
 */
export type SkillMeta = {
  Icon: LucideIcon
  description: string
  gradient: string
  bgAccent: string
  iconColor: string
}

export const SKILL_META: Record<SkillName, SkillMeta> = {
  Plumbing: {
    Icon: Wrench,
    description: 'Master pipe systems, fixing leaks, and installing new fixtures.',
    gradient: 'from-blue-500 to-cyan-400',
    bgAccent: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-500',
  },
  'Solar Installation': {
    Icon: Sun,
    description: 'Learn to mount panels, wire inverters, and set up off-grid batteries.',
    gradient: 'from-amber-500 to-orange-400',
    bgAccent: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-500',
  },
  'Electrical Wiring': {
    Icon: Zap,
    description: 'Understand voltage, outlet wiring, and panel upgrades safely.',
    gradient: 'from-indigo-500 to-purple-400',
    bgAccent: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-500',
  },
  Construction: {
    Icon: HardHat,
    description: 'Learn framing, concrete work, and structural building fundamentals.',
    gradient: 'from-emerald-500 to-teal-400',
    bgAccent: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  'Automotive Repair': {
    Icon: Car,
    description: 'Diagnose engine issues, change brakes, and perform routine maintenance.',
    gradient: 'from-red-500 to-rose-400',
    bgAccent: 'bg-red-500/10 border-red-500/20',
    iconColor: 'text-red-500',
  },
  Tailoring: {
    Icon: Scissors,
    description: 'Master stitching, pattern cutting, and garment construction techniques.',
    gradient: 'from-pink-500 to-fuchsia-400',
    bgAccent: 'bg-pink-500/10 border-pink-500/20',
    iconColor: 'text-pink-500',
  },
}
