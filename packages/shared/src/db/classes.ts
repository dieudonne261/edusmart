/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Classes (groupes d'élèves)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une "classe" représente un groupe d'élèves pour une année donnée.
 *  Elle a un enseignant *responsable* (homeroom_teacher_id) = "prof principal".
 *  Elle a une image de couverture (cover_url) qu'on peut afficher dans l'UI.
 *
 *  Tables liées :
 *  - `classes`           : la classe elle-même
 *  - `class_subjects`    : quelles matières y sont enseignées + par qui
 *  - `enrollments`       : quels élèves y sont inscrits cette année
 * ─────────────────────────────────────────────────────────────────────────────
 */


import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts, Updates } from '../supabase'

/** Row de la table classes (généré). */
export type ClassRow = Tables<'classes'>

/**
 * Liste les classes d'une école pour l'année donnée (ou l'année courante si
 * `academicYearId` n'est pas fourni).
 *
 * Renvoie aussi le nombre d'élèves inscrits (via une sous-requête count) et
 * le nom du responsable.
 */
export async function listClassesByOrganization(
  organizationId: string,
  academicYearId?: string,
) {
  const supabase = createSupabaseServerClient()

  // 1. Trouver l'année cible (courante par défaut)
  let yearId = academicYearId
  if (!yearId) {
    const { data: y } = await supabase
      .from('academic_years')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('is_current', true)
      .maybeSingle()
    yearId = y?.id
  }
  if (!yearId) return []

  // 2. Charger les classes + responsable + count élèves
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      homeroom_teacher:profiles!classes_homeroom_teacher_id_fkey(id, full_name, avatar_url),
      enrollments(count)
    `)
    .eq('organization_id', organizationId)
    .eq('academic_year_id', yearId)
    .order('grade_level')
    .order('section')

  if (error) {
    console.error('[db/classes] listClassesByOrganization', error)
    return []
  }
  return data ?? []
}

/**
 * Récupère une classe par son ID, avec ses élèves inscrits, ses matières et
 * son emploi du temps simplifié.
 */
export async function getClassDetail(classId: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      homeroom_teacher:profiles!classes_homeroom_teacher_id_fkey(id, full_name, avatar_url, email),
      class_subjects(
        id, coefficient, hours_per_week,
        subject:subjects(id, code, name, color),
        teacher:profiles!class_subjects_teacher_id_fkey(id, full_name, avatar_url)
      ),
      enrollments(
        student:students(id, student_code, first_name, last_name, avatar_url, status, average)
      )
    `)
    .eq('id', classId)
    .maybeSingle()

  if (error) {
    console.error('[db/classes] getClassDetail', error)
    return null
  }
  return data
}

/** Crée une nouvelle classe (réservé secrétariat/direction). */
export async function createClass(payload: Inserts<'classes'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('classes')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Met à jour une classe (nom, capacité, image, responsable, etc.). */
export async function updateClass(id: string, patch: Updates<'classes'>) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('classes').update(patch).eq('id', id)
  if (error) throw error
}

/** Assigne (ou réassigne) un enseignant responsable à une classe. */
export async function setHomeroomTeacher(classId: string, teacherProfileId: string | null) {
  return updateClass(classId, { homeroom_teacher_id: teacherProfileId })
}
