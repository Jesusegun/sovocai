'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, GraduationCap, ShieldCheck, UserRound } from 'lucide-react'
import { signup } from './actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'user' | 'instructor'>('user')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirm_password') ?? '')

    if (password !== confirmPassword) {
      setError('Password and confirm password must match.')
      setLoading(false)
      return
    }

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_42%),linear-gradient(to_bottom,_#f8fafc,_#ecfeff)] dark:bg-[radial-gradient(circle_at_top,_rgba(2,132,199,0.25),_transparent_42%),linear-gradient(to_bottom,_#020617,_#0f172a)]">
      <div className="w-full max-w-lg p-8 md:p-9 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/10">
        
        {/* Role Switcher Tabs */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex relative">
          {/* Sliding Background */}
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-950 rounded-full shadow-sm transition-transform duration-300 ease-in-out"
            style={{ transform: role === 'instructor' ? 'translateX(calc(100% + 8px))' : 'translateX(0)' }}
          />

          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
              role === 'user' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Sign Up as Learner
          </button>
          <button
            type="button"
            onClick={() => setRole('instructor')}
            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
              role === 'instructor' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserRound className="w-4 h-4" />
            Register as Instructor
          </button>
        </div>

        <div className="mb-7 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1 rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            {role === 'user' ? 'Learner Setup' : 'Instructor Setup'}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create your account</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            {role === 'user' 
              ? 'Join Sovocai and start your guided trade learning path.' 
              : 'Join Sovocai to publish and curate learning modules.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="role" value={role} />
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/40">{error}</div>}
          {success && <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/40">{success}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              name="full_name"
              type="text"
              required
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5 mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Retype Password</label>
            <input
              name="confirm_password"
              type="password"
              required
              className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : (role === 'user' ? 'Join as Learner' : 'Register as Instructor')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-cyan-700 dark:text-cyan-300 hover:underline font-semibold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
