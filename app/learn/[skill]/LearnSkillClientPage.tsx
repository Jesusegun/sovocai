'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronRight, Compass, PlayCircle, Sparkles } from 'lucide-react'

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

type LearnSkillClientPageProps = {
  skill: string
}

export default function LearnSkillClientPage({ skill }: LearnSkillClientPageProps) {
  const [data, setData] = useState<{ stages: Stage[]; totalVideos: number } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/learning-path?skill=${encodeURIComponent(skill)}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else setData(d)
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }, [skill])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 animate-pulse">Generating your personalized AI learning path...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading path: {error}</p>
      </div>
    )
  }

  const hasAnyVideos = Boolean(data && data.totalVideos > 0)

  if (!hasAnyVideos) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Generated Learning Path
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 md:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-5">
            <Compass className="w-7 h-7" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            No learning modules yet for {skill}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-7 max-w-2xl">
            This path is ready to generate as soon as videos are added. Ask an instructor to publish modules for this skill, then come back to get your structured Foundations to Practical Application journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 transition"
            >
              Explore other skills
            </Link>
            <Link
              href="/instructor"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Go to instructor dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Generated Learning Path
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Master {skill}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          We&apos;ve analyzed and structured {data?.totalVideos || 0} top resources into a step-by-step curriculum perfectly calibrated for your success.
        </p>
      </div>

      <div className="space-y-16">
        {data?.stages.map((stageItem, stageIdx) => {
          if (stageItem.videos.length === 0) return null

          return (
            <div key={stageItem.stage} className="relative">
              <div className="absolute left-[1.125rem] top-10 bottom-[-4rem] w-px bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block"></div>

              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 dark:border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold z-10 hidden md:flex">
                  {stageIdx + 1}
                </div>
                <h2 className="text-2xl font-bold md:ml-4 text-slate-800 dark:text-slate-100">{stageItem.stage}</h2>
              </div>

              <div className="space-y-6 md:ml-14">
                {stageItem.videos.map((video) => {
                  const showStartHere = stageItem.stage === '1. Foundations' && stageItem.videos[0]?.id === video.id

                  return (
                    <div
                      key={video.id}
                      className="relative group bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {showStartHere && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> START HERE
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-2/5 aspect-video bg-slate-100 dark:bg-slate-800 relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={video.youtube_url}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 transition-colors">
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
                              <p className="text-sm text-slate-500 dark:text-slate-400">Instructor: {video.instructor.full_name}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-sm text-slate-500 font-medium">
                              <PlayCircle className="w-4 h-4 mr-1 text-red-500" />
                              View on YouTube
                            </div>
                            <button className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                              Next module <ChevronRight className="w-4 h-4 ml-1" />
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
    </div>
  )
}
