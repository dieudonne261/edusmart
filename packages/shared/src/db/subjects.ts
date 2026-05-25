/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Subjects (matières enseignées)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Référentiel des matières par école. Permet d'avoir :
 *  - un code court (ex: "MATH")
 *  - un nom complet (ex: "Mathématiques")
 *  - une couleur d'affichage (UI bulletins, dashboards)
 *  - un coefficient par défaut (utilisé si la classe n'override pas)
 *
 *  RLS : lecture pour tous les membres de l'école, écriture staff uniquement.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts, Updates } from '../supabase'

/** Row de la table subjects (généré). */
export type SubjectRow = Tables<'subjects'>

/** Liste toutes les matières actives d'une école, triées par code. */
export async function listSubjectsByOrganization(organizationId: string): Promise<SubjectRow[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('code')
  if (error) {
    console.error('[db/subjects] listSubjectsByOrganization', error)
    return []
  }
  return data ?? []
}

/** Récupère une matière par son code (ex: "MATH") au sein d'une école. */
export async function getSubjectByCode(organizationId: string, code: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('subjects')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('code', code)
    .maybeSingle()
  return data
}

/** Crée une matière (réservé direction/secrétariat). */
export async function createSubject(payload: Inserts<'subjects'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subjects')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Met à jour une matière (nom, couleur, coefficient par défaut, etc.). */
export async function updateSubject(id: string, patch: Updates<'subjects'>) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('subjects').update(patch).eq('id', id)
  if (error) throw error
}

/**
 * Désactive une matière (`is_active = false`) plutôt que de la supprimer :
 * garde l'historique des notes intact.
 */
export async function deactivateSubject(id: string) {
  return updateSubject(id, { is_active: false })
}
