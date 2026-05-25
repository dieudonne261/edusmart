/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Students (élèves)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Élèves de l'école. Filtrage par école garanti par la RLS.
 *  La photo de profil vit dans `avatar_url` (bucket Storage `avatars`).
 *
 *  Accès :
 *  - staff (director/teacher/secretary) : tous les élèves de leur école.
 *  - parent : uniquement leurs enfants (via parent_links).
 *  - student : son propre profil (via students.user_id).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts, Updates } from '../supabase'

/** Suffixé `Row` pour éviter le clash avec le type legacy `Student` (mocks). */
export type StudentRow = Tables<'students'>

/**
 * Liste tous les élèves d'une école.
 *
 * Options :
 * - `status` : filtre sur 'active' / 'watch' / etc.
 * - `classId` : restreint aux élèves d'une classe précise.
 * - `search` : recherche textuelle sur prénom/nom/code (insensible à la casse).
 */
export async function listStudentsByOrganization(
  organizationId: string,
  opts: { status?: string; classId?: string; search?: string } = {},
) {
  const supabase = createSupabaseServerClient()
  let q = supabase
    .from('students')
    .select(`
      *,
      enrollments:enrollments!inner(
        academic_year_id, status,
        class:classes(id, name, grade_level)
      )
    `)
    .eq('organization_id', organizationId)
    .order('last_name')

  if (opts.status) q = q.eq('status', opts.status)
  if (opts.classId) q = q.eq('enrollments.class_id', opts.classId)
  if (opts.search) q = q.ilike('full_name', `%${opts.search}%`)

  const { data, error } = await q
  if (error) {
    console.error('[db/students] listStudentsByOrganization', error)
    return []
  }
  return data ?? []
}

/** Récupère un élève par son ID avec ses notes du trimestre courant. */
export async function getStudentDetail(studentId: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      enrollments(
        class:classes(id, name, grade_level, room,
          homeroom_teacher:profiles!classes_homeroom_teacher_id_fkey(full_name)
        )
      ),
      grades(
        id, value, max_value, coefficient, recorded_at, evaluation_type, title,
        subject:subjects(code, name, color),
        period:academic_periods(name, ordinal, is_current)
      ),
      parent_links(
        relation, is_primary,
        parent:profiles(id, full_name, phone, email)
      )
    `)
    .eq('id', studentId)
    .maybeSingle()
  if (error) {
    console.error('[db/students] getStudentDetail', error)
    return null
  }
  return data
}

/** Crée un nouvel élève (réservé staff). Le `student_code` est obligatoire. */
export async function createStudent(payload: Inserts<'students'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('students')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Met à jour un élève (notamment l'avatar_url après upload). */
export async function updateStudent(id: string, patch: Updates<'students'>) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('students').update(patch).eq('id', id)
  if (error) throw error
}

/**
 * Inscrit un élève dans une classe pour une année donnée.
 * Si déjà inscrit cette année, met à jour la ligne existante (UPSERT).
 */
export async function enrollStudent(
  studentId: string,
  classId: string,
  academicYearId: string,
) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('enrollments')
    .upsert(
      { student_id: studentId, class_id: classId, academic_year_id: academicYearId, status: 'active' },
      { onConflict: 'student_id,academic_year_id' },
    )
  if (error) throw error
}
