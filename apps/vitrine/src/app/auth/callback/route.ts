/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  /auth/callback — Point d'entrée OAuth & Magic Link UNIQUE
 * ─────────────────────────────────────────────────────────────────────────────
 *  Cette route vit dans la VITRINE (edusmart.site) parce qu'elle est exposée
 *  comme redirect_uri unique côté Supabase / Google OAuth (décision ADR-008 :
 *  un seul credential Google pour toutes les écoles).
 *
 *  Flux :
 *    1. Le user clique le Magic Link reçu par email, ou termine OAuth Google.
 *    2. Il arrive ici avec `?code=...` (et éventuellement `?school=<slug>`,
 *       `?next=<path>` ajoutés par notre Server Action).
 *    3. On échange le `code` contre une session Supabase → cookie posé.
 *    4. On redirige vers le bon sous-domaine + page demandée.
 *
 *  Le cookie de session est posé sur `.edusmart.site` (domaine parent) donc
 *  il est automatiquement partagé entre tous les sous-domaines.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '@edusmart/shared'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/post-login'
  const schoolSlug = url.searchParams.get('school') ?? '__root__'
  const errorParam = url.searchParams.get('error_description')

  // Cas 1 : Supabase nous renvoie une erreur (ex: lien expiré)
  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorParam)}`, req.url),
    )
  }

  // Cas 2 : pas de code → quelqu'un est arrivé ici par erreur
  if (!code) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Échange du code OAuth/OTP contre une session Supabase (pose les cookies)
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
    )
  }

  // Construire l'URL de redirection finale en respectant le sous-domaine cible.
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const isLocal =
    url.host.includes('localhost') ||
    url.host.includes('127.0.0.1') ||
    url.host.includes('[::1]')

  let target: string
  if (isLocal) {
    // En local, on n'a pas de sous-domaine, on reste sur la même origine
    // et on garde ?school= pour préserver le multi-tenant.
    const params = new URLSearchParams()
    if (schoolSlug && schoolSlug !== '__root__') params.set('school', schoolSlug)
    target = `${url.origin}${next}${params.toString() ? `?${params}` : ''}`
  } else if (schoolSlug === '__root__') {
    target = `https://${rootDomain}${next}`
  } else {
    target = `https://${schoolSlug}.${rootDomain}${next}`
  }

  return NextResponse.redirect(target)
}
