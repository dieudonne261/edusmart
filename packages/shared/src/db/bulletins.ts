/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Bulletins (relevés de notes)
 * ─────────────────────────────────────────────────────────────────────────────
 *  La table `bulletins` sert de cache des bulletins générés : moyenne calculée,
 *  rang dans la classe, mention, et URL du PDF stocké dans Supabase Storage.
 *
 *  Cycle :
 *    1. Fin de période → admin clique "Générer les bulletins"
 *    2. `upsertBulletinFromGrades` calcule la moyenne et insère/màj la ligne
 *    3. Le PDF est rendu via @react-pdf/renderer → uploadé Storage
 *    4. `pdf_url` mis à jour → parents/élèves peuvent télécharger
 *    5. Le directeur "finalise" → `finalized_at` set, plus de modif possible
 *
 *  Lecture autorisée : staff + parent de l'élève + l'élève lui-même.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'
import { calculateAverage } from '../utils/gradeCalc'

export type BulletinRow = Tables<'bulletins'>

/** Récupère le bulletin d'un élève pour une période donnée (s'il existe). */
export async function getBulletin(studentId: string, periodId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('bulletins')
    .select('*')
    .eq('student_id', studentId)
    .eq('period_id', periodId)
    .maybeSingle()
  return data
}

/** Tous les bulletins d'une période, pour génération massive ou export. */
export async function listBulletinsByPeriod(organizationId: string, periodId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('bulletins')
    .select(`
      *,
      student:students(id, student_code, first_name, last_name, avatar_url)
    `)
    .eq('organization_id', organizationId)
    .eq('period_id', periodId)
    .order('rank')
  return data ?? []
}

/**
 * Recalcule la moyenne d'un élève sur la période à partir des notes,
 * puis crée/met à jour la ligne `bulletins` (sans toucher au PDF).
 * Le PDF est uploadé séparément via `setBulletinPdfUrl`.
 */
export async function upsertBulletinFromGrades(
  organizationId: string,
  studentId: string,
  periodId: string,
  classId?: string,
) {
  const supabase = createSupabaseServerClient()

  // 1. Charger les notes de l'élève sur cette période
  const { data: grades } = await supabase
    .from('grades')
    .select('value, max_value, coefficient')
    .eq('student_id', studentId)
    .eq('period_id', periodId)

  // 2. Calculer la moyenne pondérée (utils/gradeCalc)
  const average = calculateAverage(
    (grades ?? []).map((g, i) => ({
      id: String(i),
      studentId,
      subject: '',
      score: Number(g.value),
      maxScore: Number(g.max_value),
      coefficient: Number(g.coefficient ?? 1),
    })),
  )

  // 3. Mention française classique (>=16: TB, >=14: B, >=12: AB, >=10: P)
  const mention =
    average >= 16 ? 'Très Bien'
    : average >= 14 ? 'Bien'
    : average >= 12 ? 'Assez Bien'
    : average >= 10 ? 'Passable'
    : null

  // 4. Upsert : si la ligne existe (student_id, period_id) on met à jour
  const payload: Inserts<'bulletins'> = {
    organization_id: organizationId,
    student_id: studentId,
    period_id: periodId,
    class_id: classId,
    average,
    mention,
    generated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('bulletins')
    .upsert(payload, { onConflict: 'student_id,period_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Met à jour l'URL du PDF (appelé après upload sur Supabase Storage). */
export async function setBulletinPdfUrl(bulletinId: string, pdfUrl: string) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('bulletins')
    .update({ pdf_url: pdfUrl })
    .eq('id', bulletinId)
  if (error) throw error
}

/**
 * Finalise le bulletin : verrouille les modifications. Le directeur appelle
 * cette fonction quand toutes les notes sont saisies et le PDF généré.
 */
export async function finalizeBulletin(bulletinId: string) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('bulletins')
    .update({ finalized_at: new Date().toISOString() })
    .eq('id', bulletinId)
  if (error) throw error
}
