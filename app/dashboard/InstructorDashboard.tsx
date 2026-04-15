'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { InstructorVideosList, type InstructorVideoEntry } from '@/app/components/InstructorVideosList'

type VideoEntry = InstructorVideoEntry & {
  instructor: { full_name: string | null } | null
}

type InstructorDashboardProps = {
  fullName: string
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

    fetch('/api/videos?mine=true', { signal: controller.signal })
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

      <InstructorVideosList
        videos={videos}
        loading={loading}
        emptyHint="Head to the upload page to publish your first video."
        iconTone="slate"
      />
    </div>
  )
}
