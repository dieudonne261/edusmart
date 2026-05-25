/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Grades (notes)
 * ─────────────────────────────────────────────────────────────────────────────
 *  La saisie d'une note référence : élève, classe, matière, période, enseignant.
 *
 *  RLS :
 *  - staff (teacher/director) : RW sur les notes de leur école.
 *  - parent : R sur les notes de leurs enfants.
 *  - student : R sur ses propres notes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'
import { calculateAverage } from '../utils/gradeCalc'

/** Suffixé `Row` pour éviter le clash avec le type legacy `Grade` (mocks). */
export type GradeRow = Tables<'grades'>

/** Toutes les notes d'un élève sur une période. */
export async function listGradesByStudent(
  studentId: string,
  periodId?: string,
) {
  const supabase = createSupabaseServerClient()
  let q = supabase
    .from('grades')
    .select('*, subject:subjects(code, name, color)')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
  if (periodId) q = q.eq('period_id', periodId)
  const { data, error } = await q
  if (error) {
    console.error('[db/grades] listGradesByStudent', error)
    return []
  }
  return data ?? []
}

/** Saisit une note (Server Action depuis admin/grades). */
export async function recordGrade(payload: Inserts<'grades'>) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('grades').insert(payload)
  if (error) throw error
}

/**
 * Calcule la moyenne pondérée de l'élève sur la période donnée
 * (réutilise `calculateAverage` de utils/gradeCalc).
 */
export async function computeAverageForStudent(studentId: string, periodId: string) {
  const grades = await listGradesByStudent(studentId, periodId)
  // calculateAverage attend des objets {score, maxScore, coefficient}.
  // On adapte la nomenclature DB → utils.
  return calculateAverage(
    grades.map((g) => ({
      id: g.id,
      studentId: g.student_id,
      subject: '',
      score: Number(g.value),
      maxScore: Number(g.max_value),
      coefficient: Number(g.coefficient ?? 1),
    })),
  )
}

/**
 * Calcule la moyenne de chaque élève d'une classe sur une période.
 * Utile pour le dashboard prof / responsable de classe.
 */
export async function computeClassAverages(classId: string, periodId: string) {
  const supabase = createSupabaseServerClient()
  // On charge en une seule requête : élèves de la classe + leurs notes
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student:students(
        id, first_name, last_name, avatar_url,
        grades:grades!inner(value, max_value, coefficient, period_id)
      )
    `)
    .eq('class_id', classId)

  if (error) {
    console.error('[db/grades] computeClassAverages', error)
    return []
  }

  return (data ?? [])
    .map((row: any) => {
      const s = row.student
      const periodGrades = (s?.grades ?? [])
        .filter((g: any) => g.period_id === periodId)
        .map((g: any) => ({
          id: g.id ?? '',
          studentId: s.id,
          subject: '',
          score: Number(g.value),
          maxScore: Number(g.max_value),
          coefficient: Number(g.coefficient ?? 1),
        }))
      return {
        studentId: s?.id as string,
        firstName: s?.first_name as string,
        lastName: s?.last_name as string,
        avatarUrl: s?.avatar_url as string | null,
        average: calculateAverage(periodGrades),
      }
    })
    .sort((a, b) => b.average - a.average)
}
