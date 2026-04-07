'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from './actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await signup(formData)
      if (!res.success) {
        setError(res.message ?? 'Signup failed. Please try again.')
        return
      }

      if (res.redirectTo) {
        router.push(res.redirectTo)
        return
      }

      if (res.message) {
        setSuccess(res.message)
      }
    } catch {
      setError('Unexpected error during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-sm p-8 bg-white border rounded-xl shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md">{error}</div>}
          {success && <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-md">{success}</div>}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input 
              name="full_name" 
              type="text" 
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
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
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
            <select 
              name="role" 
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            >
              <option value="user">Student / Learner</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </div>
      </div>
    </div>
  )
}
