'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Car,
  CheckCircle2,
  Clock,
  HardHat,
  Play,
  Scissors,
  Sparkles,
  TrendingUp,
  Wrench,
  Sun,
  Zap,
} from 'lucide-react'
import { SKILL_NAMES, type SkillName } from '@/utils/learning-constants'

type VideoData = {
  id: string
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags: string[] | null
  recommended_order: number
  instructor: { full_name: string | null } | null
}

type ProgressEntry = {
  id: string
  user_id: string
  video_id: string
  completed: boolean
  last_watched_at: string
  created_at: string
  video: VideoData | null
}

type LearnerDashboardProps = {
  fullName: string
}

const SKILL_CONFIG: Record<SkillName, { icon: React.ReactNode; gradient: string }> = {
  Plumbing: { icon: <Wrench className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-400' },
  'Solar Installation': { icon: <Sun className="w-5 h-5" />, gradient: 'from-amber-500 to-orange-400' },
  'Electrical Wiring': { icon: <Zap className="w-5 h-5" />, gradient: 'from-indigo-500 to-purple-400' },
  Construction: { icon: <HardHat className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-400' },
  'Automotive Repair': { icon: <Car className="w-5 h-5" />, gradient: 'from-red-500 to-rose-400' },
  Tailoring: { icon: <Scissors className="w-5 h-5" />, gradient: 'from-pink-500 to-fuchsia-400' },
}

/**
 * Learner Dashboard.
 * Shows: greeting, Continue Learning (most recent video by last_watched_at),
 * progress stats, recommended skills, and recent activity.
 *
 * @param fullName - User's display name
 */
import { useRouter } from 'next/navigation'

export function LearnerDashboard({ fullName }: LearnerDashboardProps) {
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [startingSkill, setStartingSkill] = useState<string | null>(null)
  const router = useRouter()

  const handleStartSkill = async (skill: string) => {
    setStartingSkill(skill)
    try {
      // Fetch the learning path so we can find the first video ID
      const pathRes = await fetch(`/api/learning-path?skill=${encodeURIComponent(skill)}`)
      const pathData = await pathRes.json()

      if (pathData && pathData.stages && pathData.stages.length > 0) {
        // Find the first available video across all stages
        let firstVideoId = null
        for (const stage of pathData.stages) {
          if (stage.videos.length > 0) {
            firstVideoId = stage.videos[0].id
            break
          }
        }

        // If a video exists, create a progress entry showing they've "started" the skill implicitly
        if (firstVideoId) {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_id: firstVideoId, completed: false }),
          })
        }
      }
    } catch (err) {
      console.error('Error starting skill path:', err)
    } finally {
      // Always route to the learn page regardless of backend seeding success
      router.push(`/learn/${encodeURIComponent(skill)}`)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/progress', { signal: controller.signal })
      .then((res) => res.json())
      .then((data: ProgressEntry[]) => {
        if (Array.isArray(data)) setProgress(data)
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to fetch progress:', err)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const completedCount = progress.filter((p) => p.completed).length
  const inProgressCount = progress.filter((p) => !p.completed).length

  // Continue Learning: most recently watched video (already sorted by last_watched_at DESC from API)
  const continueItem = progress.find((p) => p.video !== null) ?? null

  // Skills that user has interacted with
  const activeSkills = new Set(
    progress.filter((p) => p.video).map((p) => p.video!.skill_category)
  )

  // Recommended skills = those the user hasn't started
  const recommendedSkills = SKILL_NAMES.filter((s) => !activeSkills.has(s))

  // Recent activity: last 5
  const recentActivity = progress.slice(0, 5)

  const firstName = fullName ? fullName.split(' ')[0] : 'Learner'

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{firstName}</span>
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">
          Pick up where you left off or explore new skills.
        </p>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-10 animate-fade-in-up">
          {/* Continue Learning */}
          {continueItem && continueItem.video && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold">Continue Learning</h2>
              </div>
              <Link
                href={`/learn/${encodeURIComponent(continueItem.video.skill_category)}`}
                className="block group"
              >
                <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="md:w-72 aspect-video bg-slate-100 dark:bg-slate-800 relative flex-shrink-0">
                    <iframe
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      src={continueItem.video.youtube_url}
                      title={continueItem.video.title}
                      tabIndex={-1}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {continueItem.video.skill_category}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(continueItem.last_watched_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {continueItem.video.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(continueItem.video.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md uppercase tracking-wider font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Progress Stats */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold">Your Progress</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Completed"
                value={completedCount}
                icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
                accent="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30"
              />
              <StatCard
                label="In Progress"
                value={inProgressCount}
                icon={<Clock className="w-8 h-8 text-amber-500" />}
                accent="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30"
              />
              <StatCard
                label="Skills Started"
                value={activeSkills.size}
                icon={<BookOpen className="w-8 h-8 text-blue-500" />}
                accent="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30"
              />
            </div>
          </section>

          {/* Recommended Skills */}
          {recommendedSkills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-bold">Recommended Skills</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedSkills.map((skill) => {
                  const config = SKILL_CONFIG[skill] ?? { icon: <BookOpen className="w-5 h-5" />, gradient: 'from-slate-500 to-slate-400' }
                  return (
                    <div key={skill} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between group h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                          {config.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{skill}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Curated modules</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleStartSkill(skill)}
                        disabled={startingSkill === skill}
                        className="w-full inline-flex items-center justify-center py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
                      >
                        {startingSkill === skill ? (
                          <span className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            Starting...
                          </span>
                        ) : (
                          'Start Path'
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
                {recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      entry.completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {entry.completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.video?.title ?? 'Unknown video'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.video?.skill_category ?? ''} • {new Date(entry.last_watched_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      entry.completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {entry.completed ? 'Completed' : 'Watching'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state when no progress at all */}
          {progress.length === 0 && (
            <section className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Start your first learning path</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Choose a skill from our catalogue and begin watching structured video lessons.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Explore Skills
              </Link>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Stat card component for the progress overview section.
 */
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className={`p-5 rounded-2xl border ${accent} flex items-center gap-4`}>
      {icon}
      <div>
        <p className="text-2xl font-extrabold">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  )
}

/**
 * Skeleton loader for the dashboard while data loads.
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Continue Learning skeleton */}
      <div>
        <div className="skeleton w-48 h-6 mb-4" />
        <div className="skeleton w-full h-40 rounded-2xl" />
      </div>
      {/* Stats skeleton */}
      <div>
        <div className="skeleton w-36 h-6 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
