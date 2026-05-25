/**
 * Point d'entrée du sous-module supabase.
 * Réexporte les clients + types pour faciliter les imports :
 *
 *   import { createSupabaseServerClient, type Database } from '@edusmart/shared'
 */
export {
  createSupabaseBrowserClient,
  createSupabaseAnonClient,
} from './client'
export {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from './server'
export { updateSupabaseSession } from './middleware'
export type { Database, Json } from './types'

// Helpers de typage : "Row" d'une table sans avoir à taper Database['public']['Tables']['x']['Row']
import type { Database } from './types'
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
