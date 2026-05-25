/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CLIENT SUPABASE — Côté navigateur (browser)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  À utiliser dans les contextes suivants :
 *  - Composants React avec la directive `'use client'` (Next.js App Router)
 *  - Applications Expo (mobile, kids)
 *  - Renderer Electron (apps/desktop)
 *
 *  ❌ NE PAS utiliser ce fichier dans un Server Component, un Route Handler,
 *     ou une Server Action : préférer `./server.ts` qui gère les cookies SSR.
 *
 *  La clé exposée ici est la `anon key` : JWT signée par Supabase qui autorise
 *  uniquement les opérations permises par les **policies RLS**.
 *  Sans session utilisateur, ce client n'a accès qu'aux tables avec une policy
 *  publique (`USING (true)`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Récupère les variables d'env. Throw explicite si manquantes pour
 * éviter les erreurs runtime silencieuses du type "fetch undefined".
 */
function readEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error(
      '[@edusmart/shared] Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requises.',
    )
  }
  return { url, anonKey }
}

/**
 * Client pour les **Composants Client** Next.js (App Router).
 *
 * Particularité : `@supabase/ssr` gère automatiquement la lecture/écriture
 * des cookies de session Supabase via `document.cookie`. Du coup la session
 * reste partagée entre Server Components et Client Components.
 *
 * Usage typique :
 * ```tsx
 * 'use client'
 * import { createSupabaseBrowserClient } from '@edusmart/shared'
 *
 * const supabase = createSupabaseBrowserClient()
 * await supabase.from('news_articles').select('*')
 * ```
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = readEnv()
  return createBrowserClient<Database>(url, anonKey)
}

/**
 * Client "anonyme" pour les contextes **sans cookies** : Expo mobile/kids,
 * Electron renderer, scripts CLI.
 *
 * La session est persistée dans le storage que tu fournis (Keychain, MMKV,
 * electron-store…). À configurer dans chaque app via `auth.storage`.
 */
export function createSupabaseAnonClient() {
  const { url, anonKey } = readEnv()
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // les apps mobiles n'ont pas d'URL avec hash
    },
  })
}
