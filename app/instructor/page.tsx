'use client'

import { useState } from 'react'
import { PlusCircle, Video } from 'lucide-react'

export default function InstructorDashboard() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    
    // Parse tags (comma separated)
    const tagsString = formData.get('tags') as string
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : []

    const payload = {
      title: formData.get('title'),
      youtube_url: formData.get('youtube_url'),
      skill_category: formData.get('skill_category'),
      difficulty_level: parseInt(formData.get('difficulty_level') as string, 10),
      recommended_order: parseInt(formData.get('recommended_order') as string, 10) || 0,
      tags
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload video')
      }

      setSuccess(true)
      e.currentTarget.reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mr-4">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-slate-500">Upload and sequence learning materials.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <PlusCircle className="mr-2 w-5 h-5 text-slate-400" />
          Add New Resource
        </h2>

        {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg text-sm font-medium">Video added successfully to the Learning Path!</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Video Title</label>
            <input required name="title" type="text" placeholder="e.g. Fixing a Leaky Faucet" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">YouTube Embed URL</label>
            <input required name="youtube_url" type="url" placeholder="https://www.youtube.com/embed/..." className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" />
            <p className="text-xs text-slate-500 mt-1">Must be the embed URL, not the watch URL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Skill Category</label>
              <select required name="skill_category" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700">
                <option value="">Select a skill...</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Solar Installation">Solar Installation</option>
                <option value="Electrical Wiring">Electrical Wiring</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Stage</label>
              <select required name="difficulty_level" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700">
                <option value="1">1 - Foundations</option>
                <option value="2">2 - Core Skills</option>
                <option value="3">3 - Practical Application</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Tags (Comma separated)</label>
              <input name="tags" type="text" placeholder="safety, intro, basics" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Recommended Order</label>
              <input name="recommended_order" type="number" defaultValue="0" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Uploading...' : 'Publish to Curriculum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
