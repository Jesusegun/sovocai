'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  PlayCircle,
  Sparkles,
} from 'lucide-react'

type Video = {
  id: string
  title: string
  youtube_url: string
  tags: string[] | null
  recommended_order: number
  difficulty_level: number
  instructor: { full_name: string | null } | null
}

type Stage = {
  stage: string
  videos: Video[]
}

type ProgressEntry = {
  video_id: string
  completed: boolean
}

type LearnSkillClientPageProps = {
  skill: string
}

/**
 * Learning path page with embedded YouTube videos, stage grouping, progress tracking,
 * "Start Here" badge, and completion toggles.
 *
 * @param skill - The skill category to display
 */
export default function LearnSkillClientPage({ skill }: LearnSkillClientPageProps) {
  const [data, setData] = useState<{ stages: Stage[]; totalVideos: number } | null>(null)
  const [progress, setProgress] = useState<Map<string, boolean>>(new Map())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Fetch learning path and progress in parallel
  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetch(`/api/learning-path?skill=${encodeURIComponent(skill)}`, { signal: controller.signal }).then((r) => r.json()),
      fetch('/api/progress', { signal: controller.signal }).then((r) => r.json()).catch(() => []),
    ])
      .then(([pathData, progressData]) => {
        if (pathData.error) {
          setError(pathData.error)
        } else {
          setData(pathData)
        }

        if (Array.isArray(progressData)) {
          const map = new Map<string, boolean>()
          progressData.forEach((entry: ProgressEntry) => {
            map.set(entry.video_id, entry.completed)
          })
          setProgress(map)
        }
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [skill])

  /**
   * Toggle completion status for a video and record last_watched_at.
   */
  const toggleComplete = useCallback(async (videoId: string) => {
    setTogglingId(videoId)
    const currentStatus = progress.get(videoId) ?? false

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, completed: !currentStatus }),
      })

      if (res.ok) {
        setProgress((prev) => {
          const next = new Map(prev)
          next.set(videoId, !currentStatus)
          return next
        })
      } else {
        const errData = await res.json()
        alert(`Failed to save progress: ${errData.error || 'Unknown error'}`)
        console.error('Progress API error:', errData)
      }
    } catch (err) {
      console.error('Failed to toggle progress:', err)
      alert(`Network error saving progress: ${(err as Error).message}`)
    } finally {
      setTogglingId(null)
    }
  }, [progress])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-slate-500 animate-pulse">Generating your personalized AI learning path...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 text-red-500">
          <p>Error loading path: {error}</p>
        </div>
      </div>
    )
  }

  const hasAnyVideos = Boolean(data && data.totalVideos > 0)

  if (!hasAnyVideos) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Generated Learning Path
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 md:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-5">
            <Compass className="w-7 h-7" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            No learning modules yet for {skill}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-7 max-w-2xl">
            This path is ready to generate as soon as videos are added. Ask an instructor to publish modules for this skill, then come back for your structured learning journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 transition"
            >
              Explore other skills
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate progress statistics
  const allVideoIds = data?.stages.flatMap((s) => s.videos.map((v) => v.id)) ?? []
  const completedCount = allVideoIds.filter((id) => progress.get(id)).length
  const overallPercent = allVideoIds.length > 0 ? Math.round((completedCount / allVideoIds.length) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-20">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Generated Learning Path
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Master {skill}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          We&apos;ve analyzed and structured {data?.totalVideos ?? 0} top resources into a step-by-step curriculum perfectly calibrated for your success.
        </p>

        {/* Overall Progress */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 progress-bar-track bg-slate-200 dark:bg-slate-800">
            <div
              className="progress-bar-fill bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 tabular-nums w-12 text-right">
            {overallPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          {completedCount} of {allVideoIds.length} modules completed
        </p>
      </div>

      {/* Stages */}
      <div className="space-y-16 animate-fade-in-up">
        {data?.stages.map((stageItem, stageIdx) => {
          if (stageItem.videos.length === 0) return null

          const stageCompleted = stageItem.videos.filter((v) => progress.get(v.id)).length
          const stagePercent = Math.round((stageCompleted / stageItem.videos.length) * 100)

          return (
            <div key={stageItem.stage} className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[1.125rem] top-10 bottom-[-4rem] w-px bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block" />

              {/* Stage header */}
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 dark:border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold z-10 hidden md:flex">
                  {stageIdx + 1}
                </div>
                <h2 className="text-2xl font-bold md:ml-4">{stageItem.stage}</h2>
              </div>

              {/* Stage progress bar */}
              <div className="flex items-center gap-3 mb-6 md:ml-14">
                <div className="flex-1 progress-bar-track bg-slate-200 dark:bg-slate-800 max-w-xs">
                  <div
                    className="progress-bar-fill bg-emerald-500"
                    style={{ width: `${stagePercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {stageCompleted}/{stageItem.videos.length}
                </span>
              </div>

              {/* Video cards */}
              <div className="space-y-6 md:ml-14">
                {stageItem.videos.map((video) => {
                  const showStartHere =
                    stageItem.stage === '1. Foundations' && stageItem.videos[0]?.id === video.id
                  const isCompleted = progress.get(video.id) ?? false
                  const isToggling = togglingId === video.id

                  return (
                    <div
                      key={video.id}
                      className={`relative group bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                        isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900/40'
                          : 'dark:border-slate-800'
                      }`}
                    >
                      {/* Start Here badge */}
                      {showStartHere && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center animate-pulse-glow">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> START HERE
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row">
                        {/* Video embed */}
                        <div className="lg:w-2/5 aspect-video bg-slate-100 dark:bg-slate-800 relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={video.youtube_url}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        {/* Video info */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                              {video.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(video.tags ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md uppercase tracking-wider font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {video.instructor?.full_name && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Instructor: {video.instructor.full_name}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-sm text-slate-500 font-medium">
                              <PlayCircle className="w-4 h-4 mr-1 text-red-500" />
                              View on YouTube
                            </div>

                            {/* Mark as completed button */}
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => toggleComplete(video.id)}
                              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                              } disabled:opacity-50`}
                            >
                              {isToggling ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                              {isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Next steps */}
      {overallPercent === 100 && (
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white text-center animate-fade-in-up">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold mb-2">Path Complete! 🎉</h2>
          <p className="text-emerald-100 mb-6">
            You&apos;ve completed all modules for {skill}. Ready for the next challenge?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all"
          >
            Explore More Skills <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
