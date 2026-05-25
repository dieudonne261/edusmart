/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VITRINE TENANT — Résolution du contexte multi-école côté vitrine
 * ─────────────────────────────────────────────────────────────────────────────
 *  Mode `root`   → marketing global (edusmart.site), pas d'école précise.
 *  Mode `school` → vitrine d'une école identifiée par son slug
 *                  (ex: strelitzia.edusmart.site).
 *
 *  Lit `x-school-slug` posé par le middleware, puis va chercher l'organisation
 *  dans Supabase via le helper `getOrganizationBySlug` de @edusmart/shared.
 *
 *  Async parce qu'on touche la DB. Toutes les pages qui l'utilisent doivent
 *  être des Server Components async.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getOrganizationBySlug, type Tables } from '@edusmart/shared'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export type OrganizationRow = Tables<'organizations'>

export type TenantContext =
  | { mode: 'root'; host: string; isLocal: boolean; school: null; slug: '__root__' }
  | { mode: 'school'; host: string; isLocal: boolean; school: OrganizationRow; slug: string }

export async function getTenantContext(): Promise<TenantContext> {
  const headerStore = headers()
  const slug = headerStore.get('x-school-slug') ?? '__root__'
  const host = headerStore.get('x-host') ?? ''
  const isLocal =
    host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]')

  if (slug === '__root__') {
    return { mode: 'root', host, isLocal, school: null, slug: '__root__' }
  }

  const school = await getOrganizationBySlug(slug)
  // Slug fourni mais aucune école → 404 propre (au lieu de fallback silencieux)
  if (!school) notFound()

  return { mode: 'school', host, isLocal, school, slug }
}

/** Construit un lien interne en préservant ?school= en local. */
export function schoolHref(path: string, slug: string, isLocal: boolean) {
  if (!isLocal) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}school=${slug}`
}
