export const SKILL_NAMES = [
  'Plumbing',
  'Solar Installation',
  'Electrical Wiring',
  'Construction',
  'Automotive Repair',
  'Tailoring',
] as const

export type SkillName = (typeof SKILL_NAMES)[number]

export const DIFFICULTY_LEVELS = [1, 2, 3] as const
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: 'Foundations',
  2: 'Core Skills',
  3: 'Practical Application',
}

export const STAGE_BY_DIFFICULTY: Record<DifficultyLevel, string> = {
  1: '1. Foundations',
  2: '2. Core Skills',
  3: '3. Practical Application',
}

export const STAGE_ORDER = [
  STAGE_BY_DIFFICULTY[1],
  STAGE_BY_DIFFICULTY[2],
  STAGE_BY_DIFFICULTY[3],
] as const

export type StageLabel = (typeof STAGE_ORDER)[number]

export function getDifficultyLabel(level: number): string {
  return DIFFICULTY_LABELS[level as DifficultyLevel] ?? `Level ${level}`
}
