'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { requestPasswordReset } from './actions'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await requestPasswordReset(formData)
      if (!res.success) {
        setError(res.message ?? 'Failed to request a password reset link.')
        return
      }
      setSuccess(res.message)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_45%),linear-gradient(to_bottom,_#f8fafc,_#f0fdf4)] dark:bg-[radial-gradient(circle_at_top,_rgba(5,150,105,0.26),_transparent_45%),linear-gradient(to_bottom,_#020617,_#0f172a)]">
      <div className="w-full max-w-md p-8 md:p-9 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/10">
        <div className="mb-7">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-4">
            Account Recovery
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Forgot password?</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Enter your email and we&apos;ll send you a secure recovery link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/40">{error}</div>}
          {success && <div className="p-3 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">{success}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send recovery email'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link href="/login" className="text-emerald-700 dark:text-emerald-300 hover:underline font-semibold">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
