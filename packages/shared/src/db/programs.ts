/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Programs (programmes pédagogiques affichés sur la vitrine)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Lecture publique (policy `public_read_programs USING (true)`).
 *  Pas d'auth nécessaire côté lecture.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables } from '../supabase'

/** Suffixé `Row` pour éviter le clash avec le type legacy `Program` (mocks). */
export type ProgramRow = Tables<'programs'>

/** Liste les programmes d'une école (triés par `display_order`). */
export async function listProgramsByOrganization(organizationId: string): Promise<ProgramRow[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('organization_id', organizationId)
    .order('display_order')
  if (error) {
    console.error('[db/programs] listProgramsByOrganization', error)
    return []
  }
  return data ?? []
}

/** Récupère les programmes mis en avant (booléen `is_featured`). */
export async function listFeaturedPrograms(organizationId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('programs')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_featured', true)
    .order('display_order')
  return data ?? []
}
