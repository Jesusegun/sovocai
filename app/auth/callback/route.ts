import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

function getSafeNextPath(input: string): string {
  if (!input || !input.startsWith('/')) return '/'
  if (input.startsWith('//')) return '/'
  if (input.includes('\\')) return '/'
  return input
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = getSafeNextPath(requestUrl.searchParams.get('next') ?? '/')
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL('/login?error=invalid_recovery_link', requestUrl.origin))
    }
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })

    if (error) {
      return NextResponse.redirect(new URL('/login?error=invalid_recovery_link', requestUrl.origin))
    }

    const destination = type === 'recovery' ? '/reset-password' : next
    return NextResponse.redirect(new URL(destination, requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/login?error=invalid_recovery_link', requestUrl.origin))
}
