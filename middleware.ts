import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Early return for public pages when no session
  if (!session && (pathname === '/login' || pathname === '/register')) {
    return response
  }

  // Helper function to get user role (with caching potential)
  const getUserRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    return profile?.role
  }

  // Protected routes for organizers
  if (pathname.startsWith('/organizer')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const role = await getUserRole(session.user.id)
    if (role !== 'organizer') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protected routes for runners
  if (pathname.startsWith('/runner')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const role = await getUserRole(session.user.id)
    if (role !== 'runner') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Allow access to login/register pages when there's a session
  // This prevents redirect loops during login process
  if (pathname === '/login' || pathname === '/register') {
    return response
  }

  return response
}

export const config = {
  matcher: ['/organizer/:path*', '/runner/:path*', '/login', '/register'],
}
