/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Attendance (présences / absences)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Le pointage se fait par demi-journée (morning / afternoon) ou journée
 *  entière (full_day). Statuts possibles :
 *  - present
 *  - absent
 *  - late
 *  - justified_absent (absence justifiée)
 *  - justified_late   (retard justifié)
 *
 *  Contrainte UNIQUE (student_id, date, period) → on ne peut pas avoir 2
 *  pointages contradictoires pour le même créneau.
 *
 *  Utilisé par :
 *  - Saisie des présences par les enseignants au début du cours.
 *  - Tableau de bord parent (taux d'absentéisme).
 *  - Algorithme de détection du décrochage (P3).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'

/** Row de la table attendance (généré). */
export type AttendanceRow = Tables<'attendance'>

/** Pointages d'un élève sur une période donnée. */
export async function listAttendanceByStudent(
  studentId: string,
  opts: { from?: string; to?: string } = {},
) {
  const supabase = createSupabaseServerClient()
  let q = supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
  if (opts.from) q = q.gte('date', opts.from)
  if (opts.to) q = q.lte('date', opts.to)
  const { data } = await q
  return data ?? []
}

/** Pointages d'une classe à une date donnée (vue prof). */
export async function listAttendanceByClassDate(classId: string, date: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('attendance')
    .select('*, student:students(id, first_name, last_name, avatar_url)')
    .eq('class_id', classId)
    .eq('date', date)
  return data ?? []
}

/**
 * Marque la présence d'un élève (upsert : si déjà pointé pour cette
 * date+période, on met à jour le statut).
 */
export async function markAttendance(payload: Inserts<'attendance'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('attendance')
    .upsert(payload, { onConflict: 'student_id,date,period' })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Calcule le taux de présence d'un élève sur une plage.
 * (présences + retards justifiés / total) × 100
 */
export async function computeAttendanceRate(
  studentId: string,
  from: string,
  to: string,
) {
  const records = await listAttendanceByStudent(studentId, { from, to })
  if (records.length === 0) return null
  const present = records.filter((r) =>
    ['present', 'justified_late'].includes(r.status),
  ).length
  return Math.round((present / records.length) * 1000) / 10 // 1 décimale
}
