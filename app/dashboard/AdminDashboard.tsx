'use client'

import { useEffect, useState } from 'react'
import { Activity, Clock, Users, Video } from 'lucide-react'

type AdminStats = {
  totalUsers: number
  totalVideos: number
}

type RecentVideo = {
  id: string
  title: string
  skill_category: string
  difficulty_level: number
  created_at: string
  instructor: { full_name: string | null } | { full_name: string | null }[] | null
}

/**
 * Admin dashboard component.
 * Shows: platform stats (users, videos) and recent video uploads.
 */
export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalVideos: 0 })
  const [recentVideos, setRecentVideos] = useState<RecentVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetch('/api/admin/overview', { signal: controller.signal }).then((r) => r.json()),
      fetch('/api/videos', { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([overview, videos]) => {
        if (overview.error) {
          setError(overview.error)
          return
        }
        setStats(overview)

        if (Array.isArray(videos)) {
          // Sort by created_at desc, take last 10
          const sorted = [...videos].sort(
            (a: RecentVideo, b: RecentVideo) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setRecentVideos(sorted.slice(0, 10))
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  /**
   * Normalize instructor shape — Supabase may return an object or array.
   */
  const getInstructorName = (instructor: RecentVideo['instructor']): string | null => {
    if (!instructor) return null
    if (Array.isArray(instructor)) return instructor[0]?.full_name ?? null
    return instructor.full_name ?? null
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="p-6 text-center text-red-500 font-bold border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 rounded-2xl">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Platform Overview</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Live system statistics and recent content activity.
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-40 rounded-2xl" />
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-10 animate-fade-in-up">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-10 h-10 text-blue-500 mb-4" />
              <div className="text-4xl font-extrabold mb-1">{stats.totalUsers}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Registered Users</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow">
              <Video className="w-10 h-10 text-indigo-500 mb-4" />
              <div className="text-4xl font-extrabold mb-1">{stats.totalVideos}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Learning Modules</div>
            </div>
          </div>

          {/* Recent Uploads */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-bold">Recent Uploads</h2>
            </div>
            {recentVideos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl">
                <Video className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No videos uploaded yet.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
                {recentVideos.map((video) => {
                  const instructorName = getInstructorName(video.instructor)
                  return (
                    <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{video.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {video.skill_category}
                          {instructorName && ` • by ${instructorName}`}
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(video.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
