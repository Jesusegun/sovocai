'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getSafeNextPath } from '@/utils/safe-redirect'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const confirmPassword = String(formData.get('confirm_password') ?? '').trim()
  const fullName = String(formData.get('full_name') ?? '').trim()
  const role = String(formData.get('role') ?? '').trim().toLowerCase()
  const next = getSafeNextPath(String(formData.get('next') ?? '/'))

  if (!email || !password || !confirmPassword || !fullName) {
    return { success: false, message: 'Full name, email, password, and confirm password are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Password and confirm password must match.' }
  }

  if (role !== 'user' && role !== 'instructor') {
    return { success: false, message: 'Invalid role selection.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // Best-effort fallback for setups where profile trigger is missing or delayed.
  // This succeeds only if a session is immediately available.
  if (data.user && data.session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profileError) {
      return {
        success: false,
        message: 'Account was created, but we could not verify your profile. Please try logging in again.',
      }
    }

    if (!profile) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role,
      })

      if (insertError) {
        return {
          success: false,
          message: 'Account was created, but profile creation failed. Please contact support.',
        }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true, redirectTo: next }
  }

  // Email confirmation flow: auth user exists, trigger should create profile.
  // We avoid silent success by returning explicit guidance to the user.
  revalidatePath('/', 'layout')
  return {
    success: true,
    requiresEmailConfirmation: true,
    message: 'Check your email to confirm your account, then log in.',
  }
}
