/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  @edusmart/shared — Point d'entrée
 * ─────────────────────────────────────────────────────────────────────────────
 *  Tout ce qui est partagé entre les 6 apps (admin, vitrine, desktop, mobile,
 *  kids, test) passe par ce package.
 *
 *  Conventions d'import depuis les apps :
 *
 *  import {
 *    createSupabaseServerClient,
 *    listStudentsByOrganization,
 *    calculateAverage,
 *    type Database,
 *    type Tables,
 *  } from '@edusmart/shared'
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Types métier "front-friendly" (avant Supabase) ─────────────────────────────
//    Conservés pour rétrocompatibilité avec les composants admin/vitrine
//    actuels qui consomment encore mock-data.
export * from './types/organization'
export * from './types/student'
export * from './types/grade'

// ── Utilitaires purs ──────────────────────────────────────────────────────────
export * from './utils/slugify'
export * from './utils/gradeCalc'

// ── Données mock (à supprimer progressivement au profit de db/) ───────────────
//    Encore utilisé par certaines pages tant qu'elles ne sont pas branchées
//    sur Supabase. À déprécier une fois STEP_05 et STEP_06 terminés.
export * as mocks from './mock-data'

// ── Supabase : clients + types générés ────────────────────────────────────────
export {
  createSupabaseBrowserClient,
  createSupabaseAnonClient,
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
  updateSupabaseSession,
} from './supabase'
export type { Database, Json, Tables, Inserts, Updates } from './supabase'

// ── Data helpers (server-side, RLS-aware) ─────────────────────────────────────
export * from './db'
