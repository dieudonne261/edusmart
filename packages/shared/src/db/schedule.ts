/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Schedule Slots (emploi du temps)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Chaque ligne représente UN créneau récurrent dans la semaine pour UNE
 *  classe : matière + enseignant + jour de la semaine + heure début/fin + salle.
 *
 *  Convention `day_of_week` :
 *    1 = Lundi, 2 = Mardi, ... 6 = Samedi, 7 = Dimanche (ISO 8601).
 *
 *  Pour gérer un changement d'emploi du temps en cours d'année, on utilise
 *  `effective_from` / `effective_until` (optionnels) plutôt que de modifier
 *  une ligne existante : ainsi l'historique est préservé.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'

export type ScheduleSlotRow = Tables<'schedule_slots'>

/**
 * Emploi du temps complet d'une classe (semaine type), trié par jour puis
 * heure. Joint la matière et l'enseignant pour affichage UI.
 */
export async function getClassSchedule(classId: string) {
  const supabase = createSupabaseServerClient()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('schedule_slots')
    .select(`
      *,
      subject:subjects(code, name, color),
      teacher:profiles!schedule_slots_teacher_id_fkey(full_name, avatar_url)
    `)
    .eq('class_id', classId)
    // Filtre les créneaux actifs aujourd'hui :
    .or(`effective_from.is.null,effective_from.lte.${today}`)
    .or(`effective_until.is.null,effective_until.gte.${today}`)
    .order('day_of_week')
    .order('starts_at')
  return data ?? []
}

/** Emploi du temps d'un enseignant (toutes ses classes), pour la semaine. */
export async function getTeacherSchedule(teacherProfileId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('schedule_slots')
    .select(`
      *,
      subject:subjects(code, name, color),
      class:classes(id, name, grade_level, room)
    `)
    .eq('teacher_id', teacherProfileId)
    .order('day_of_week')
    .order('starts_at')
  return data ?? []
}

/** Ajoute un créneau (drag-and-drop dans l'UI emploi du temps). */
export async function createScheduleSlot(payload: Inserts<'schedule_slots'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('schedule_slots')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Supprime un créneau de l'emploi du temps. */
export async function deleteScheduleSlot(id: string) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('schedule_slots').delete().eq('id', id)
  if (error) throw error
}
