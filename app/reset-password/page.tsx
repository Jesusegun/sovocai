'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const MIN_PASSWORD_LENGTH = 8

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      const { data, error: userError } = await supabase.auth.getUser()

      if (!mounted) return

      if (userError || !data.user) {
        setError('Recovery session is invalid or expired. Request a new password reset email.')
      }

      setReady(true)
    }

    void bootstrap()

    return () => {
      mounted = false
    }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirm_password') ?? '')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password must match.')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }

      await supabase.auth.signOut()
      setSuccess('Password updated. Redirecting to login...')
      setTimeout(() => {
        router.push('/login?status=password-reset')
      }, 900)
    } catch {
      setError('Unable to reset password right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_45%),linear-gradient(to_bottom,_#fff7ed,_#fff1f2)] dark:bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.25),_transparent_45%),linear-gradient(to_bottom,_#020617,_#0f172a)]">
      <div className="w-full max-w-md p-8 md:p-9 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/10">
        <div className="mb-7">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full mb-4">
            Secure Password Update
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Reset your password</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Choose a new password for your account.</p>
        </div>

        {!ready ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">Checking recovery session...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/40">{error}</div>}
            {success && <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/40">{success}</div>}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="confirm_password"
                  type="password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating password...' : 'Update password'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-sm text-slate-500">
          <Link href="/forgot-password" className="text-orange-700 dark:text-orange-300 hover:underline font-semibold">
            Request a new recovery link
          </Link>
        </div>
      </div>
    </div>
  )
}
