'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Video, Clock, Tag } from 'lucide-react'

type VideoEntry = {
  id: string
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags: string[] | null
  recommended_order: number
  created_at: string
  instructor: { full_name: string | null } | null
}

type InstructorDashboardProps = {
  fullName: string
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Foundations',
  2: 'Core Skills',
  3: 'Practical Application',
}

/**
 * Instructor dashboard.
 * Shows: welcome message, upload CTA, and My Videos list.
 *
 * @param fullName - Instructor's display name
 */
export function InstructorDashboard({ fullName }: InstructorDashboardProps) {
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/videos', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data)
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to fetch videos:', err)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const firstName = fullName ? fullName.split(' ')[0] : 'Instructor'

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{firstName}</span>
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">
          Manage your training materials and publish new video resources.
        </p>
      </div>

      {/* Upload CTA */}
      <div className="mb-10 animate-fade-in-up">
        <Link
          href="/instructor"
          className="flex items-center gap-4 p-6 rounded-2xl border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Upload New Video
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Add a YouTube video to the learning curriculum
            </p>
          </div>
        </Link>
      </div>

      {/* My Videos */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-slate-400" />
          <h2 className="text-xl font-bold">My Videos</h2>
          <span className="ml-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
            {videos.length}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl">
            <Video className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No videos uploaded yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Head to the upload page to publish your first video.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{video.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{video.skill_category}</span>
                    <span>•</span>
                    <span>{DIFFICULTY_LABELS[video.difficulty_level] ?? `Level ${video.difficulty_level}`}</span>
                    {video.tags && video.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {video.tags.slice(0, 3).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(video.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
