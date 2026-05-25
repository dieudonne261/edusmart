import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const school = url.searchParams.get('school')
  await request.formData()

  const redirectUrl = new URL('/contact', request.url)
  redirectUrl.searchParams.set('sent', '1')

  if (school) {
    redirectUrl.searchParams.set('school', school)
  }

  return NextResponse.redirect(redirectUrl, 303)
}
