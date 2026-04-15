import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/** Maximum allowed length for text fields to prevent abuse. */
const MAX_TITLE_LENGTH = 200
const MAX_URL_LENGTH = 500
const MAX_SKILL_LENGTH = 100
const MAX_TAG_LENGTH = 50
const MAX_TAGS_COUNT = 20

type CreateVideoPayload = {
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags?: string[]
  recommended_order?: number
}

/**
 * Normalizes various YouTube URL formats into a consistent embed URL.
 *
 * @param input - The raw YouTube URL
 * @returns The normalized embed URL, or null if the input is invalid
 */
function normalizeYouTubeEmbedUrl(input: string): string | null {
  try {
    const parsed = new URL(input)
    const host = parsed.hostname.toLowerCase()

    if (host.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      return input
    }

    if (host.includes('youtube.com') && parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    return null
  } catch {
    return null
  }
}

/**
 * Validates and sanitizes the video creation payload.
 * Enforces length limits to prevent storage abuse (VULN-5 fix).
 *
 * @param raw - The raw request body
 * @returns A validated payload or an error message
 */
function validatePayload(raw: unknown): { ok: true; value: CreateVideoPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid request body.' }
  }

  const payload = raw as Record<string, unknown>
  const title = String(payload.title ?? '').trim()
  const skillCategory = String(payload.skill_category ?? '').trim()
  const youtubeUrlRaw = String(payload.youtube_url ?? '').trim()
  const difficulty = Number(payload.difficulty_level)
  const recommendedOrder = Number(payload.recommended_order ?? 0)
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)
    : []

  if (!title) return { ok: false, error: 'Title is required.' }
  if (title.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.` }
  }
  if (!skillCategory) return { ok: false, error: 'Skill category is required.' }
  if (skillCategory.length > MAX_SKILL_LENGTH) {
    return { ok: false, error: `Skill category must be ${MAX_SKILL_LENGTH} characters or fewer.` }
  }
  if (youtubeUrlRaw.length > MAX_URL_LENGTH) {
    return { ok: false, error: `YouTube URL must be ${MAX_URL_LENGTH} characters or fewer.` }
  }
  if (![1, 2, 3].includes(difficulty)) {
    return { ok: false, error: 'Difficulty level must be 1, 2, or 3.' }
  }
  if (!Number.isInteger(recommendedOrder) || recommendedOrder < 0 || recommendedOrder > 9999) {
    return { ok: false, error: 'Recommended order must be a non-negative integer (max 9999).' }
  }
  if (tags.length > MAX_TAGS_COUNT) {
    return { ok: false, error: `A maximum of ${MAX_TAGS_COUNT} tags are allowed.` }
  }
  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
    return { ok: false, error: `Each tag must be ${MAX_TAG_LENGTH} characters or fewer.` }
  }

  const normalizedYoutubeUrl = normalizeYouTubeEmbedUrl(youtubeUrlRaw)
  if (!normalizedYoutubeUrl) {
    return { ok: false, error: 'A valid YouTube URL is required.' }
  }

  return {
    ok: true,
    value: {
      title,
      youtube_url: normalizedYoutubeUrl,
      skill_category: skillCategory,
      difficulty_level: difficulty,
      tags,
      recommended_order: recommendedOrder,
    },
  }
}

/**
 * POST /api/videos — Create a new video resource.
 * Restricted to authenticated users with the 'instructor' role.
 */
export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'instructor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const validated = validatePayload(body)
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('videos')
    .insert({
      ...validated.value,
      instructor_id: user.id
    })
    .select('*, instructor:profiles(full_name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/**
 * GET /api/videos — List videos.
 * Requires authentication (VULN-2 fix).
 *
 * Query params:
 *   ?skill=<name>     — Filter by skill category
 *   ?mine=true        — Return only the current user's videos (for instructors)
 */
export async function GET(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const skill = searchParams.get('skill')
  const mine = searchParams.get('mine') === 'true'

  let query = supabase.from('videos').select('*, instructor:profiles(full_name)')

  if (mine) {
    query = query.eq('instructor_id', user.id)
  }
  if (skill) {
    query = query.eq('skill_category', skill)
  }

  const { data, error } = await query
    .order('difficulty_level', { ascending: true })
    .order('recommended_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
