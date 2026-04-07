'use client'

import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await login(formData)
      if (res && !res.success) {
        setError(res.message)
      }
    } catch {
      // Ignore Next.js redirect throw
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-sm p-8 bg-white border rounded-xl shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-500">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  )
}
