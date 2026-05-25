/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MIDDLEWARE SUPABASE — Rafraîchissement de session
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  À appeler depuis le `middleware.ts` de chaque app Next.js qui utilise
 *  l'auth (admin, vitrine).
 *
 *  Rôle :
 *  - Lire le cookie d'authentification Supabase.
 *  - Si le token est expiré, déclencher un refresh (réécrit le cookie).
 *  - Sans ça, le user serait silencieusement déconnecté toutes les heures.
 *
 *  Usage typique :
 *  ```ts
 *  // apps/admin/src/middleware.ts
 *  import { updateSupabaseSession } from '@edusmart/shared'
 *
 *  export async function middleware(req) {
 *    // 1. Résolution du slug multi-tenant (existant)
 *    // ...
 *    // 2. Refresh session Supabase
 *    return updateSupabaseSession(req)
 *  }
 *  ```
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from './types'

export async function updateSupabaseSession(
  request: NextRequest,
): Promise<NextResponse> {
  // Réponse initiale : on copie les headers de la requête.
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Si Supabase écrit un nouveau cookie (refresh token), on doit le
        // propager à la fois sur la requête (pour les Server Components qui
        // vont s'exécuter ensuite dans la même requête) et sur la réponse
        // (pour le navigateur).
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // L'appel à getUser() force la lecture du token, déclenche le refresh
  // si nécessaire, et écrit le nouveau cookie via les callbacks ci-dessus.
  await supabase.auth.getUser()

  return response
}
