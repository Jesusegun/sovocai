'use server'

import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

const GENERIC_RECOVERY_MESSAGE =
  'If an account exists for that email, we sent a password recovery link.'

function getRequestOrigin(headerStore: Headers): string | null {
  const forwardedHost = headerStore.get('x-forwarded-host')
  const host = forwardedHost ?? headerStore.get('host')
  if (!host) return null

  const forwardedProto = headerStore.get('x-forwarded-proto')
  const proto = forwardedProto === 'http' || forwardedProto === 'https' ? forwardedProto : 'http'
  return `${proto}://${host}`
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!email) {
    return { success: false, message: 'Email is required.' }
  }

  const supabase = await createClient()
  const headerStore = await headers()

  const appOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    getRequestOrigin(headerStore) ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim()

  if (!appOrigin) {
    return {
      success: false,
      message: 'Unable to build a recovery link. Please contact support.',
    }
  }

  const normalizedOrigin = appOrigin.startsWith('http') ? appOrigin : `https://${appOrigin}`
  const redirectTo = `${normalizedOrigin.replace(/\/$/, '')}/auth/callback?next=/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    // Return a generic message to avoid leaking whether an email exists.
    return { success: true, message: GENERIC_RECOVERY_MESSAGE }
  }

  return { success: true, message: GENERIC_RECOVERY_MESSAGE }
}
