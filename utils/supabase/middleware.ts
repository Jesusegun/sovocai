import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'

type SessionResult = {
  response: NextResponse
  user: User | null
}

/**
 * Refreshes the Supabase auth session by reading/writing cookies
 * and returns both the updated response and the authenticated user (if any).
 *
 * @param request - The incoming Next.js middleware request
 * @returns An object containing the response (with refreshed cookies) and the user
 */
export async function updateSession(request: NextRequest): Promise<SessionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Avoid taking down all routes if env vars are missing in the deployment.
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      response: NextResponse.next({
        request: { headers: request.headers },
      }),
      user: null,
    }
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user: User | null = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Session refresh errors should not block route rendering.
    return {
      response: NextResponse.next({
        request: { headers: request.headers },
      }),
      user: null,
    }
  }

  return { response: supabaseResponse, user }
}
