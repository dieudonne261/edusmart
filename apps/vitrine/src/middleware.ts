import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const deploymentDomains = [
    rootDomain,
    `www.${rootDomain}`,
  ].filter(Boolean)
  const requestHeaders = new Headers(req.headers)

  let slug = '__root__'

  const isLocalHost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('[::1]')
  const isVercelHost = host.endsWith('.vercel.app')

  if (req.nextUrl.pathname === '/admin' || req.nextUrl.pathname.startsWith('/admin/')) {
    const adminPath = req.nextUrl.pathname.replace(/^\/admin/, '') || '/'
    const adminOrigin = isLocalHost ? 'http://localhost:3002' : `https://admin.${rootDomain}`
    const adminUrl = new URL(adminPath, adminOrigin)
    adminUrl.search = req.nextUrl.search
    return NextResponse.redirect(adminUrl)
  }

  if (isLocalHost) {
    slug = req.nextUrl.searchParams.get('school') ?? '__root__'
  } else if (!isVercelHost && !deploymentDomains.includes(host)) {
    slug = host.replace(`.${rootDomain}`, '').split('.')[0]
  }

  requestHeaders.set('x-school-slug', slug)
  requestHeaders.set('x-host', host)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
