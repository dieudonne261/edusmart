/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Organizations (écoles)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Toutes les fonctions ci-dessous tournent en Server Component / Server Action.
 *  Elles utilisent le client SSR : la RLS s'applique avec l'identité du user
 *  connecté (sauf pour les lectures publiques type "vitrine").
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables } from '../supabase'

/**
 * Type Row de la table organizations (généré depuis Supabase).
 * Suffixé `Row` pour éviter la collision avec le type legacy `Organization`
 * défini dans `src/types/organization.ts` (utilisé par les mocks).
 */
export type OrganizationRow = Tables<'organizations'>

/**
 * Récupère une école par son slug (sous-domaine).
 *
 * - Pour `__root__` (vitrine globale `edusmart.site`), on retourne `null`
 *   car ce n'est pas une école réelle.
 * - Les écoles ont une policy `public_read_orgs USING (true)` → lecture libre.
 */
export async function getOrganizationBySlug(slug: string): Promise<OrganizationRow | null> {
  if (!slug || slug === '__root__') return null

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle() // maybeSingle retourne null si 0 ligne (plutôt qu'une erreur)

  if (error) {
    console.error('[db/organizations] getOrganizationBySlug', { slug, error })
    return null
  }
  return data
}

/**
 * Liste toutes les écoles (pour le super_admin ou la page racine vitrine).
 * Retourne uniquement les champs nécessaires à l'affichage en liste.
 */
export async function listOrganizations() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('organizations')
    .select('id, slug, name, city, logo_url, status')
    .eq('status', 'active')
    .order('name')
  return data ?? []
}

/**
 * Met à jour les paramètres généraux d'une école (réservé au directeur).
 * La RLS `org_update_director` vérifie déjà le rôle.
 */
export async function updateOrganization(
  id: string,
  patch: Partial<Pick<OrganizationRow, 'name' | 'tagline' | 'description' | 'logo_url' | 'banner_url' | 'colors' | 'address' | 'phone' | 'email' | 'website'>>,
) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('organizations')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}
