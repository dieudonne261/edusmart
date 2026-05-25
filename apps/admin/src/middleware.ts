import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const requestHeaders = new Headers(req.headers)

  let slug = 'strelitzia'

  const isLocalHost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('[::1]')

  if (isLocalHost) {
    slug = req.nextUrl.searchParams.get('school') ?? 'strelitzia'
  } else if (host !== rootDomain && host !== `admin.${rootDomain}`) {
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
