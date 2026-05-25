/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Academic Years + Periods (calendrier scolaire)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une école déclare plusieurs années scolaires (ex: 2025-2026, 2026-2027) et
 *  chaque année est découpée en *périodes* (trimestres / semestres / quarters).
 *
 *  Une seule année est "courante" (`is_current = true`) à la fois — utilisée
 *  par défaut par les pages admin (saisie notes, classes, etc.).
 *
 *  De même, une seule période est "courante" : c'est celle dans laquelle on
 *  saisit les notes en ce moment.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'

/** Row de la table academic_years (généré). */
export type AcademicYearRow = Tables<'academic_years'>
/** Row de la table academic_periods (généré). */
export type AcademicPeriodRow = Tables<'academic_periods'>

/* ────────────────────────────────────────────────────────────────────────── */
/*  ANNÉES SCOLAIRES                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

/** Toutes les années d'une école (la plus récente en premier). */
export async function listAcademicYears(organizationId: string): Promise<AcademicYearRow[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('organization_id', organizationId)
    .order('starts_on', { ascending: false })
  if (error) {
    console.error('[db/academic] listAcademicYears', error)
    return []
  }
  return data ?? []
}

/** L'année courante d'une école (la seule avec `is_current = true`). */
export async function getCurrentAcademicYear(organizationId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('academic_years')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_current', true)
    .maybeSingle()
  return data
}

/** Crée une nouvelle année scolaire. */
export async function createAcademicYear(payload: Inserts<'academic_years'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('academic_years')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Définit l'année courante. Désactive automatiquement l'ancienne
 * (atomicité via 2 UPDATE dans une transaction implicite côté DB).
 */
export async function setCurrentAcademicYear(organizationId: string, yearId: string) {
  const supabase = createSupabaseServerClient()
  // 1. Désactiver toutes les années de l'école
  await supabase
    .from('academic_years')
    .update({ is_current: false })
    .eq('organization_id', organizationId)
  // 2. Activer la nouvelle
  const { error } = await supabase
    .from('academic_years')
    .update({ is_current: true })
    .eq('id', yearId)
  if (error) throw error
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PÉRIODES                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/** Toutes les périodes d'une année (T1, T2, T3 — triées par ordinal). */
export async function listPeriodsByYear(academicYearId: string): Promise<AcademicPeriodRow[]> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('academic_periods')
    .select('*')
    .eq('academic_year_id', academicYearId)
    .order('ordinal')
  return data ?? []
}

/** La période courante d'une école (ex: "Trimestre 2"). */
export async function getCurrentPeriod(organizationId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('academic_periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_current', true)
    .maybeSingle()
  return data
}

/** Crée une période (trimestre/semestre). */
export async function createPeriod(payload: Inserts<'academic_periods'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('academic_periods')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Marque une période comme courante (désactive l'ancienne automatiquement). */
export async function setCurrentPeriod(organizationId: string, periodId: string) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('academic_periods')
    .update({ is_current: false })
    .eq('organization_id', organizationId)
  const { error } = await supabase
    .from('academic_periods')
    .update({ is_current: true })
    .eq('id', periodId)
  if (error) throw error
}
