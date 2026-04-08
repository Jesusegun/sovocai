import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LearnerDashboard } from './LearnerDashboard'
import { InstructorDashboard } from './InstructorDashboard'
import { AdminDashboard } from './AdminDashboard'

/**
 * /dashboard — Role-based home page.
 * Server component that checks auth + role and renders the appropriate dashboard.
 */
export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'user'
  const fullName = profile?.full_name ?? ''

  if (role === 'admin') {
    return <AdminDashboard />
  }

  if (role === 'instructor') {
    return <InstructorDashboard fullName={fullName} />
  }

  return <LearnerDashboard fullName={fullName} />
}
