/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Homeworks + Submissions (devoirs)
 * ─────────────────────────────────────────────────────────────────────────────
 *  - `homeworks` : un devoir donné par un enseignant à une classe.
 *  - `homework_submissions` : la réponse d'un élève (upload fichier + texte).
 *
 *  Cycle :
 *    enseignant crée un homework  →  élève soumet (avant `due_at`)
 *    →  prof note + feedback        →  affiché dans bulletin parent
 *
 *  RLS :
 *  - homeworks      : RW staff de l'école, R toute la classe.
 *  - submissions    : R élève concerné + parents + staff, W élève uniquement.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts, Updates } from '../supabase'

export type HomeworkRow = Tables<'homeworks'>
export type HomeworkSubmissionRow = Tables<'homework_submissions'>

/* ────────────────────────────────────────────────────────────────────────── */
/*  HOMEWORKS                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

/** Liste les devoirs d'une classe (à venir d'abord). */
export async function listHomeworksByClass(classId: string, opts: { upcomingOnly?: boolean } = {}) {
  const supabase = createSupabaseServerClient()
  let q = supabase
    .from('homeworks')
    .select(`
      *,
      subject:subjects(code, name, color),
      teacher:profiles!homeworks_teacher_id_fkey(full_name, avatar_url)
    `)
    .eq('class_id', classId)
    .eq('is_published', true)
    .order('due_at')
  if (opts.upcomingOnly) q = q.gte('due_at', new Date().toISOString())
  const { data } = await q
  return data ?? []
}

/** Devoirs à rendre par un élève (toutes ses classes confondues). */
export async function listHomeworksForStudent(studentId: string) {
  const supabase = createSupabaseServerClient()
  // On passe par enrollments pour trouver les classes de l'élève
  const { data: enrolls } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', studentId)
    .eq('status', 'active')
  const classIds = (enrolls ?? []).map((e) => e.class_id)
  if (classIds.length === 0) return []

  const { data } = await supabase
    .from('homeworks')
    .select(`
      *,
      subject:subjects(code, name, color),
      submission:homework_submissions(id, submitted_at, score, is_late)
    `)
    .in('class_id', classIds)
    .eq('is_published', true)
    .gte('due_at', new Date().toISOString())
    .order('due_at')
  return data ?? []
}

/** Crée un devoir (réservé enseignant/direction). */
export async function createHomework(payload: Inserts<'homeworks'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('homeworks')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Met à jour un devoir (titre, deadline, publication, etc.). */
export async function updateHomework(id: string, patch: Updates<'homeworks'>) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('homeworks').update(patch).eq('id', id)
  if (error) throw error
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  SUBMISSIONS                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

/** L'élève soumet sa réponse. Marque automatiquement `is_late` si en retard. */
export async function submitHomework(
  homeworkId: string,
  studentId: string,
  payload: { content?: string; file_url?: string },
) {
  const supabase = createSupabaseServerClient()
  // Vérifie la deadline pour calculer is_late côté serveur
  const { data: hw } = await supabase
    .from('homeworks')
    .select('due_at')
    .eq('id', homeworkId)
    .single()
  const isLate = hw ? new Date(hw.due_at) < new Date() : false

  const { data, error } = await supabase
    .from('homework_submissions')
    .upsert(
      {
        homework_id: homeworkId,
        student_id: studentId,
        content: payload.content,
        file_url: payload.file_url,
        submitted_at: new Date().toISOString(),
        is_late: isLate,
      },
      { onConflict: 'homework_id,student_id' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

/** Le prof note la soumission + feedback. */
export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string | undefined,
  graderProfileId: string,
) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('homework_submissions')
    .update({
      score,
      feedback,
      graded_at: new Date().toISOString(),
      graded_by: graderProfileId,
    })
    .eq('id', submissionId)
  if (error) throw error
}
