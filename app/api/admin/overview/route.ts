import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Enforce admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: videosCount } = await supabase.from('videos').select('*', { count: 'exact', head: true })

  return NextResponse.json({
    totalUsers: usersCount || 0,
    totalVideos: videosCount || 0
  })
}
