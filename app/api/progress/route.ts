import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/progress
 *
 * Returns all progress entries for the authenticated user.
 * Optional query parameter: ?skill=<skill_category> to filter by skill.
 *
 * @returns Array of user_progress rows joined with video data.
 */
export async function GET(req: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const skill = searchParams.get('skill')

    let query = supabase
      .from('user_progress')
      .select('*, video:videos(id, title, youtube_url, skill_category, difficulty_level, tags, recommended_order, instructor:profiles(full_name))')
      .eq('user_id', user.id)
      .order('last_watched_at', { ascending: false })

    if (skill) {
      query = query.eq('video.skill_category', skill)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // When filtering by skill via joined column, Supabase returns rows with null video
    // if the join condition didn't match. Filter those out.
    const filtered = skill
      ? (data ?? []).filter((row: Record<string, unknown>) => row.video !== null)
      : (data ?? [])

    return NextResponse.json(filtered)
  } catch (err) {
    console.error('GET /api/progress error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

type ProgressPayload = {
  video_id: string
  completed?: boolean
}

/**
 * POST /api/progress
 *
 * Upserts a progress entry for the authenticated user.
 * Body: { video_id: string, completed?: boolean }
 *
 * - If no entry exists, creates one with last_watched_at = now()
 * - If entry exists, updates completed status and last_watched_at
 *
 * @returns The upserted progress row.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await req.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const payload = body as ProgressPayload
    const videoId = String(payload.video_id ?? '').trim()

    if (!videoId) {
      return NextResponse.json({ error: 'video_id is required' }, { status: 400 })
    }

    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(videoId)) {
      return NextResponse.json({ error: 'Invalid video_id format' }, { status: 400 })
    }

    // Verify video exists
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id')
      .eq('id', videoId)
      .single()

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const completed = typeof payload.completed === 'boolean' ? payload.completed : true
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          video_id: videoId,
          completed,
          last_watched_at: now,
        },
        { onConflict: 'user_id,video_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('POST /api/progress error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
