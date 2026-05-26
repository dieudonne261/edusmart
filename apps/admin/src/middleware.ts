/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MIDDLEWARE — apps/admin
 * ─────────────────────────────────────────────────────────────────────────────
 *  Trois rôles :
 *    1. Multi-tenant : extraire le slug du sous-domaine (ou ?school= en local)
 *       et le poser dans un header `x-school-slug` lu par les Server Components.
 *    2. Refresh de session Supabase à chaque requête (sinon le user est
 *       déconnecté silencieusement après 1h).
 *    3. Gate d'auth : redirige vers /login si l'utilisateur essaie d'accéder
 *       à une route protégée sans session.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

/** Routes accessibles SANS être connecté. Le reste est protégé. */
const PUBLIC_PATHS = ['/login', '/auth/callback', '/forbidden', '/404']

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const defaultSchoolSlug =
    process.env.NEXT_PUBLIC_DEFAULT_ADMIN_SCHOOL_SLUG ??
    process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_SLUG ??
    'uaz'
  const requestHeaders = new Headers(req.headers)

  /* ── 1) Résolution du slug multi-tenant ─────────────────────────────── */
  let slug = defaultSchoolSlug
  const isLocalHost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('[::1]')
  const isVercelHost = host.endsWith('.vercel.app')

  if (isLocalHost) {
    slug = req.nextUrl.searchParams.get('school') ?? defaultSchoolSlug
  } else if (!isVercelHost && host !== rootDomain && host !== `admin.${rootDomain}`) {
    slug = host.replace(`.${rootDomain}`, '').split('.')[0]
  }
  requestHeaders.set('x-school-slug', slug)
  requestHeaders.set('x-host', host)

  /* ── 2) Refresh session Supabase (réécriture cookies) ───────────────── */
  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: CookieOptions) => {
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // Force le refresh du token si nécessaire (réécrit le cookie).
  const { data: { user } } = await supabase.auth.getUser()

  /* ── 3) Gate auth : redirige /login si protégé sans session ─────────── */
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (!user && !isPublic) {
    const loginUrl = new URL('/login', req.url)
    // En local, on préserve le query ?school= pour ne pas casser le multi-tenant
    if (isLocalHost) loginUrl.searchParams.set('school', slug)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf)).*)'],
}
