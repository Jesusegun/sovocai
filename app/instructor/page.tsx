import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import InstructorUploadPage from './InstructorUploadPage'

/**
 * /instructor — Server-side auth gate for the instructor upload page.
 * Verifies the user is authenticated AND has the 'instructor' role.
 * Non-instructors are redirected to the dashboard.
 */
export default async function InstructorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/instructor')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'instructor') {
    redirect('/dashboard')
  }

  return <InstructorUploadPage />
}
