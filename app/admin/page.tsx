import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AdminDashboard } from '../dashboard/AdminDashboard'

/**
 * /admin — Server-side auth gate for the admin panel.
 * Verifies the user is authenticated AND has the 'admin' role.
 * Non-admins are redirected to the dashboard.
 */
export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <AdminDashboard />
}
