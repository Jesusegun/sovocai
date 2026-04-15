'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Server action for user sign-out.
 * Using a server action provides automatic CSRF protection,
 * unlike a plain route handler with form POST.
 *
 * @throws Redirects to '/' after signing out.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
