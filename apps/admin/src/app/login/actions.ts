'use server'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SERVER ACTIONS — Login admin
 * ─────────────────────────────────────────────────────────────────────────────
 *  Trois méthodes d'authentification exposées :
 *    1. signInWithPassword       — Email + mot de passe (méthode classique).
 *    2. signInWithMagicLink      — Email seul, lien envoyé sur sa boîte.
 *    3. signInWithGoogle         — OAuth Google (callback unique sur edusmart.site).
 *
 *  Toutes utilisent `createSupabaseServerClient()` qui propage les cookies de
 *  session (donc après un signIn, l'utilisateur est immédiatement reconnu).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

/** Type de retour standard pour les Server Actions de formulaire. */
export type AuthActionResult = { error?: string; success?: boolean; info?: string }

/** Construit l'URL absolue de notre app (utile pour les redirects OAuth/Magic Link). */
function getAppOrigin(): string {
  const h = headers()
  const host = h.get('x-host') ?? h.get('host') ?? 'edusmart.site'
  const proto = host.includes('localhost') ? 'http' : 'https'
  return `${proto}://${host}`
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  1. EMAIL + PASSWORD                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export async function signInWithPassword(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { error: 'Email et mot de passe requis.' }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/post-login')
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  2. MAGIC LINK (OTP par email)                                             */
/* ────────────────────────────────────────────────────────────────────────── */

export async function signInWithMagicLink(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { error: 'Email requis.' }

  const supabase = createSupabaseServerClient()
  const headerStore = headers()
  const slug = headerStore.get('x-school-slug') ?? '__root__'
  const callbackBase =
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL ?? `${getAppOrigin()}/auth/callback`
  // Important : le `emailRedirectTo` pointe vers notre route /auth/callback
  // qui finalise la session (échange du `code` contre un token).
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${callbackBase}?school=${slug}&next=/post-login`,
    },
  })
  if (error) return { error: error.message }

  return {
    success: true,
    info: `Un lien de connexion vient d'être envoyé à ${email}. Vérifie ta boîte (et le dossier spam).`,
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  3. GOOGLE OAUTH                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

export async function signInWithGoogle(): Promise<void> {
  const supabase = createSupabaseServerClient()
  const headerStore = headers()
  const slug = headerStore.get('x-school-slug') ?? '__root__'

  // Le callback passe par le domaine racine (edusmart.site/auth/callback)
  // car Google OAuth n'accepte qu'un seul redirect_uri par credential.
  // L'info `school` est ajoutée en query pour qu'après login on redirige
  // vers le bon sous-domaine.
  const callbackBase =
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL ?? `${getAppOrigin()}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${callbackBase}?school=${slug}&next=/post-login`,
    },
  })

  if (error) {
    throw new Error(`Google OAuth: ${error.message}`)
  }
  if (data.url) redirect(data.url)
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  LOGOUT                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export async function signOut(): Promise<void> {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
