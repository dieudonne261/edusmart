import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''

  // Production: "test.edusmart.site" -> slug = "test"
  // Local:      "localhost:3005"     -> slug = "localhost"
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const slug = host
    .replace(`.${rootDomain}`, '')
    .replace(':3005', '')
    .split('.')[0]

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-school-slug', slug)
  requestHeaders.set('x-host', host)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
