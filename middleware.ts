import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Don't run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/repositories', '/segments', '/contributors']

  // Redirect to login page if accessing protected routes without authentication
  if (protectedRoutes.some(route => path.startsWith(route)) && !user) {
    // Check if we're already being redirected to prevent loops
    const isRedirected = request.nextUrl.searchParams.get('redirected') === 'true'
    if (isRedirected) {
      // If we're already being redirected, just continue to the login page without another redirect
      return supabaseResponse
    }

    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirected', 'true')
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login page while already authenticated, redirect to dashboard
  if (path === '/login' && user) {
    // Check if we're already being redirected to prevent loops
    const isRedirected = request.nextUrl.searchParams.get('redirected') === 'true'
    if (isRedirected) {
      // If we're already being redirected, just continue to the dashboard without another redirect
      return supabaseResponse
    }

    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('redirected', 'true')
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}