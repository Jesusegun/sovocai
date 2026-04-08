'use client'

import { useEffect, useState } from 'react'
import { Clock, PlusCircle, Tag, Video } from 'lucide-react'

type VideoEntry = {
  id: string
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags: string[] | null
  recommended_order: number
  created_at: string
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Foundations',
  2: 'Core Skills',
  3: 'Practical Application',
}

/**
 * Instructor page with upload form and "My Videos" list.
 * Handles video submission and displays instructor's uploaded content.
 */
export default function InstructorPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [videosLoading, setVideosLoading] = useState(true)

  /** Fetch instructor's videos on mount */
  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/videos', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data)
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to load videos:', err)
        }
      })
      .finally(() => setVideosLoading(false))

    return () => controller.abort()
  }, [])

  /**
   * Handle video upload form submission.
   * Validates and sends to POST /api/videos.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const tagsString = formData.get('tags') as string
    const tags = tagsString
      ? tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: formData.get('title'),
      youtube_url: formData.get('youtube_url'),
      skill_category: formData.get('skill_category'),
      difficulty_level: parseInt(formData.get('difficulty_level') as string, 10),
      recommended_order: parseInt(formData.get('recommended_order') as string, 10) || 0,
      tags,
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload video')
      }

      const newVideo = await res.json()
      setSuccess(true)
      setVideos((prev) => [newVideo, ...prev])
      e.currentTarget.reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center mb-8 animate-fade-in">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Upload and sequence learning materials.</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm mb-10 animate-fade-in-up">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <PlusCircle className="mr-2 w-5 h-5 text-blue-500" />
          Add New Resource
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm border border-red-200 dark:border-red-900/40">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-sm font-medium border border-green-200 dark:border-green-900/40">
            Video added successfully to the Learning Path!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="video-title" className="block text-sm font-medium mb-1.5">Video Title</label>
            <input
              id="video-title"
              required
              name="title"
              type="text"
              placeholder="e.g. Fixing a Leaky Faucet"
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="youtube-url" className="block text-sm font-medium mb-1.5">YouTube URL</label>
            <input
              id="youtube-url"
              required
              name="youtube_url"
              type="url"
              placeholder="https://www.youtube.com/embed/... or watch URL"
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-xs text-slate-500 mt-1.5">Accepted formats: embed URL, watch URL, or youtu.be short link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="skill-category" className="block text-sm font-medium mb-1.5">Skill Category</label>
              <select
                id="skill-category"
                required
                name="skill_category"
                className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select a skill...</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Solar Installation">Solar Installation</option>
                <option value="Electrical Wiring">Electrical Wiring</option>
                <option value="Construction">Construction</option>
                <option value="Automotive Repair">Automotive Repair</option>
                <option value="Tailoring">Tailoring</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty-level" className="block text-sm font-medium mb-1.5">Difficulty Stage</label>
              <select
                id="difficulty-level"
                required
                name="difficulty_level"
                className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="1">1 — Foundations</option>
                <option value="2">2 — Core Skills</option>
                <option value="3">3 — Practical Application</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="video-tags" className="block text-sm font-medium mb-1.5">Tags (Comma-separated)</label>
              <input
                id="video-tags"
                name="tags"
                type="text"
                placeholder="safety, intro, basics"
                className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="recommended-order" className="block text-sm font-medium mb-1.5">Recommended Order</label>
              <input
                id="recommended-order"
                name="recommended_order"
                type="number"
                defaultValue="0"
                min="0"
                className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              {loading ? 'Publishing...' : 'Publish to Curriculum'}
            </button>
          </div>
        </form>
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

        {videosLoading ? (
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
              Use the form above to publish your first video.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{video.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
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
