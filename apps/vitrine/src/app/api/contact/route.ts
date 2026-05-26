import { NextResponse } from 'next/server'
import { createSupabaseServiceRoleClient } from '@edusmart/shared'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const formData = await request.formData()
  const school = url.searchParams.get('school') ?? request.headers.get('x-school-slug') ?? '__root__'
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const phone = String(formData.get('phone') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const redirectUrl = new URL('/contact', request.url)
  if (school) {
    redirectUrl.searchParams.set('school', school)
  }

  if (!name || !email || !message) {
    redirectUrl.searchParams.set('error', 'missing')
    return NextResponse.redirect(redirectUrl, 303)
  }

  const supabase = createSupabaseServiceRoleClient()
  const { data: organization } =
    school && school !== '__root__'
      ? await supabase.from('organizations').select('id, email, name').eq('slug', school).maybeSingle()
      : { data: null }

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    phone: phone || null,
    subject: subject || 'Demande depuis la vitrine',
    message,
    school_slug: school,
    organization_id: organization?.id ?? null,
  })

  if (error) {
    console.error('[vitrine/contact] contact_messages insert failed', error)
    redirectUrl.searchParams.set('error', 'storage')
    return NextResponse.redirect(redirectUrl, 303)
  }

  if (process.env.RESEND_API_KEY) {
    const to = organization?.email ?? process.env.CONTACT_TO_EMAIL ?? 'contact@edusmart.site'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'EduSmart <noreply@edusmart.site>',
        to: [to],
        subject: `[EduSmart] ${subject || `Contact ${school}`}`,
        reply_to: email,
        text: `${name}\n${email}${phone ? `\n${phone}` : ''}\n\n${message}`,
      }),
    }).catch((err) => {
      console.error('[vitrine/contact] resend failed', err)
    })
  }

  redirectUrl.searchParams.set('sent', '1')
  return NextResponse.redirect(redirectUrl, 303)
}
