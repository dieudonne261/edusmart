/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ADMIN TENANT — Résolution du contexte multi-école côté admin
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sur l'app admin, le sous-domaine indique quelle école on est en train de
 *  gérer. Ce module :
 *    1. Lit `x-school-slug` (posé par le middleware).
 *    2. Charge l'`organization` correspondante depuis Supabase.
 *    3. Vérifie que l'utilisateur connecté a le droit d'y accéder
 *       (super_admin → OK partout, sinon profile.organization_id doit matcher).
 *
 *  Cette fonction est **async** parce qu'on tape la DB. Toutes les pages qui
 *  l'utilisent doivent donc être des Server Components async.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getOrganizationBySlug, type Tables } from '@edusmart/shared'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentProfile, type AuthProfile } from './auth-helpers'

export type OrganizationRow = Tables<'organizations'>

export type AdminTenant = {
  school: OrganizationRow
  slug: string
  host: string
  isLocal: boolean
  profile: AuthProfile
}

/**
 * Variante "publique" (sans auth) : juste résoudre l'école depuis le slug.
 * Utilisée par la page /login (avant que le user soit connecté).
 */
export async function getAdminTenantPublic(): Promise<{
  school: OrganizationRow | null
  slug: string
  host: string
  isLocal: boolean
}> {
  const headerStore = headers()
  const host = headerStore.get('x-host') ?? ''
  const slug = headerStore.get('x-school-slug') ?? 'strelitzia'
  const isLocal =
    host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]')
  const school = await getOrganizationBySlug(slug)
  return { school, slug, host, isLocal }
}

/**
 * Variante "protégée" : exige une session valide + vérifie le cross-tenant.
 * Utilisée par toutes les pages /admin/* sauf /login.
 *
 * Sécurité :
 * - Pas de session → redirect /login
 * - Slug invalide → redirect /404
 * - Slug ≠ organisation du user (et pas super_admin) → redirect /forbidden
 */
export async function getAdminTenant(): Promise<AdminTenant> {
  const { school, slug, host, isLocal } = await getAdminTenantPublic()
  if (!school) redirect('/404')

  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  // 🛡️ Anti cross-tenant : un user d'une autre école ne doit PAS voir cette org.
  // Le super_admin a le droit de naviguer dans toutes les écoles.
  if (profile.role !== 'super_admin' && profile.organization_id !== school.id) {
    redirect('/forbidden')
  }

  return { school, slug, host, isLocal, profile }
}

/**
 * Construit un lien interne en préservant le `?school=` en local
 * (où le sous-domaine n'est pas dispo).
 */
export function adminHref(path: string, slug: string, isLocal: boolean) {
  if (!isLocal) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}school=${slug}`
}
