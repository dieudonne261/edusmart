/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AUTH HELPERS (apps/admin)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Façade autour de Supabase Auth pour récupérer le user courant + son profil
 *  (rôle, organisation) côté serveur.
 *
 *  À utiliser dans :
 *  - Server Components qui ont besoin de connaître le user.
 *  - Server Actions pour vérifier l'autorisation avant d'écrire.
 *  - middleware.ts pour les redirections /login si pas de session.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

export type AuthProfile = {
  id: string
  email: string | null
  organization_id: string | null
  role: 'super_admin' | 'director' | 'teacher' | 'secretary' | 'parent' | 'student'
  full_name: string | null
  avatar_url: string | null
}

/**
 * Récupère le profil de l'utilisateur connecté, ou `null` si pas connecté.
 * Lit `auth.users` via cookie + jointure `profiles`.
 */
export async function getCurrentProfile(): Promise<AuthProfile | null> {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, organization_id, role, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) return null
  return {
    id: profile.id,
    email: user.email ?? null,
    organization_id: profile.organization_id,
    role: profile.role as AuthProfile['role'],
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
  }
}

/**
 * Variante stricte : si pas de session, redirige vers /login.
 * À utiliser dans toutes les pages /admin/* (sauf /login lui-même).
 */
export async function requireProfile(): Promise<AuthProfile> {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  return profile
}

/**
 * Vérifie que le user a un des rôles autorisés. Sinon → /forbidden.
 *
 * Exemple :
 *   await requireRole(['director', 'super_admin'])  // page settings école
 *   await requireRole(['teacher', 'director', 'super_admin'])  // saisie notes
 */
export async function requireRole(allowed: AuthProfile['role'][]): Promise<AuthProfile> {
  const profile = await requireProfile()
  if (!allowed.includes(profile.role)) redirect('/forbidden')
  return profile
}

/**
 * Mapping rôle → route par défaut après login. Utilisé par /post-login.
 */
const REDIRECT_BY_ROLE: Record<AuthProfile['role'], string> = {
  super_admin: '/',          // dashboard global
  director:    '/',          // dashboard école
  teacher:     '/grades',    // saisie notes
  secretary:   '/students',  // gestion élèves
  parent:      '/dashboard', // (futur, dans vitrine)
  student:     '/dashboard', // (futur, dans vitrine)
}

export function redirectByRole(role: AuthProfile['role']): string {
  return REDIRECT_BY_ROLE[role] ?? '/'
}
