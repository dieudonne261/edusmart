/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CLIENT SUPABASE — Côté serveur (Next.js App Router)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Deux fonctions :
 *
 *  1. `createSupabaseServerClient()` — pour Server Components, Server Actions,
 *     Route Handlers (`app/api/*`). Lit/écrit les cookies via le helper
 *     `next/headers.cookies()` → la session de l'utilisateur connecté est
 *     respectée, et la RLS s'applique normalement à ses requêtes.
 *
 *  2. `createSupabaseServiceRoleClient()` — pour les Edge Functions, scripts
 *     d'administration, webhooks. **BYPASS LA RLS** → à utiliser uniquement
 *     côté serveur, et avec parcimonie (validation explicite des entrées).
 *
 *  ❌ NE JAMAIS importer ce fichier dans un Composant Client (`'use client'`)
 *     ou un fichier qui finit dans le bundle browser.
 *     La `SUPABASE_SERVICE_ROLE_KEY` doit rester côté serveur.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Client pour les **Server Components / Server Actions / Route Handlers**
 * Next.js 14.
 *
 * - Lit le cookie `sb-<project-ref>-auth-token` pour récupérer la session.
 * - Rafraîchit automatiquement le token si expiré (via le middleware).
 * - La RLS s'applique avec l'identité de l'utilisateur connecté.
 *
 * Usage typique :
 * ```tsx
 * // apps/admin/src/app/students/page.tsx
 * import { createSupabaseServerClient } from '@edusmart/shared'
 *
 * export default async function Page() {
 *   const supabase = createSupabaseServerClient()
 *   const { data: students } = await supabase.from('students').select('*')
 *   // → RLS filtre automatiquement à l'organization_id du user
 *   return <StudentsTable students={students ?? []} />
 * }
 * ```
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      // Lecture : où trouver le cookie
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      // Écriture : utilisée par le SDK quand il rafraîchit la session.
      // Le try/catch évite les erreurs quand le client est instancié dans
      // un contexte où l'écriture de cookie est interdite (Server Component
      // pendant le render). Le middleware Next.js gère le refresh propre.
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* noop — invocation depuis Server Component, ignorer */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          /* noop */
        }
      },
    },
  })
}

/**
 * Client **service_role** (admin) — BYPASS LA RLS.
 *
 * À utiliser uniquement pour :
 * - Edge Functions (signup webhook, cron, etc.)
 * - Scripts d'administration (import CSV, batch)
 * - Endpoints "système" qui doivent voir toutes les tables
 *
 * ⚠️ Avec ce client, toutes les requêtes ont les pleins droits.
 *    → Toujours valider l'entrée utilisateur et le contexte avant d'agir.
 */
export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!serviceKey) {
    throw new Error(
      '[@edusmart/shared] SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SECRET_KEY) requis pour le client service_role.',
    )
  }
  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false, // pas de cookies en mode service
      autoRefreshToken: false,
    },
  })
}
