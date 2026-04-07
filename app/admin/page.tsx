'use client'

import { useEffect, useState } from 'react'
import { Activity, Users, Video } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalVideos: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or Failed to load stats.')
        return res.json()
      })
      .then(data => {
        if (data.error) throw new Error(data.error)
        setStats(data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading admin stats...</div>
  if (error) return <div className="p-8 text-center text-red-500 font-bold border border-red-200 bg-red-50 rounded-lg">{error}</div>

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center mr-4">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="text-slate-500">Live system statistics and monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center h-48 shadow-sm">
          <Users className="w-10 h-10 text-blue-500 mb-4" />
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">{stats.totalUsers}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Registered Users</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center h-48 shadow-sm">
          <Video className="w-10 h-10 text-indigo-500 mb-4" />
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">{stats.totalVideos}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Learning Modules</div>
        </div>
      </div>
    </div>
  )
}
