import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import {
  STAGE_BY_DIFFICULTY,
  STAGE_ORDER,
  type StageLabel,
} from '@/utils/learning-constants'

type VideoRow = {
  id: string
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags: string[] | null
  recommended_order: number | null
  instructor: { full_name: string | null } | null
}

type RawVideoRow = Omit<VideoRow, 'instructor'> & {
  instructor: { full_name: string | null }[] | null
}

function hasFoundationPriority(tags: string[] | null): boolean {
  if (!tags || tags.length === 0) return false
  const normalized = tags.map((tag) => tag.toLowerCase())
  return normalized.includes('safety') || normalized.includes('intro')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const skill = searchParams.get('skill')

  if (!skill) return NextResponse.json({ error: 'Skill is required' }, { status: 400 })

  const supabase = await createClient()

  // 1. Fetch ordered videos
  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, title, youtube_url, skill_category, difficulty_level, tags, recommended_order, instructor:profiles(full_name)')
    .eq('skill_category', skill)
    .order('difficulty_level', { ascending: true })
    .order('recommended_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const normalizedVideos: VideoRow[] = ((videos ?? []) as RawVideoRow[]).map((video) => ({
    ...video,
    instructor: Array.isArray(video.instructor) ? (video.instructor[0] ?? null) : null,
  }))

  // 2. Group into stages
  const stages: Record<StageLabel, VideoRow[]> = {
    [STAGE_BY_DIFFICULTY[1]]: [],
    [STAGE_BY_DIFFICULTY[2]]: [],
    [STAGE_BY_DIFFICULTY[3]]: [],
  }

  normalizedVideos.forEach((video) => {
    if (video.difficulty_level === 1 || video.difficulty_level === 2 || video.difficulty_level === 3) {
      stages[STAGE_BY_DIFFICULTY[video.difficulty_level]].push(video)
    }
  })

  // Foundations sort rule: safety/intro first, then recommended_order ASC, stable by id.
  stages[STAGE_BY_DIFFICULTY[1]].sort((a, b) => {
    const aPriority = hasFoundationPriority(a.tags) ? 1 : 0
    const bPriority = hasFoundationPriority(b.tags) ? 1 : 0

    if (aPriority !== bPriority) return bPriority - aPriority

    const aOrder = a.recommended_order ?? 0
    const bOrder = b.recommended_order ?? 0
    if (aOrder !== bOrder) return aOrder - bOrder

    return a.id.localeCompare(b.id)
  })

  return NextResponse.json({
    stages: STAGE_ORDER.map((stage) => ({ stage, videos: stages[stage] })),
    totalVideos: normalizedVideos.length
  })
}
