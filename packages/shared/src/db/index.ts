/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sous-module `db` — Façade des helpers data côté serveur
 * ─────────────────────────────────────────────────────────────────────────────
 *  Tous ces helpers s'exécutent en Server Component / Server Action / Route
 *  Handler. Ils s'appuient sur `createSupabaseServerClient()` qui propage la
 *  session SSR de l'utilisateur, donc la RLS s'applique automatiquement.
 *
 *  Convention de nommage :
 *  - `listXxxByY(...)`  → renvoie un tableau (filtre par contexte)
 *  - `getXxxById(...)`  → renvoie un objet ou null
 *  - `createXxx(...)`   → insertion (utilisé par les Server Actions)
 *  - `updateXxx(...)`   → mise à jour partielle
 *  - `computeXxx(...)`  → calculs dérivés (moyenne, taux, etc.)
 *
 *  Import depuis les apps :
 *    import {
 *      listStudentsByOrganization,
 *      recordGrade,
 *      computeAttendanceRate,
 *    } from '@edusmart/shared'
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Structure école ───────────────────────────────────────────────────────────
export * from './organizations'   // écoles
export * from './academic'        // années + périodes scolaires
export * from './subjects'        // référentiel matières
export * from './classes'         // classes (groupes d'élèves + responsable)

// ── Élèves & inscriptions ────────────────────────────────────────────────────
export * from './students'        // élèves + parent_links + enrollments

// ── Pédagogie ────────────────────────────────────────────────────────────────
export * from './grades'          // notes + moyennes
export * from './homeworks'       // devoirs + soumissions
export * from './attendance'      // pointages
export * from './schedule'        // emploi du temps

// ── Bulletins ────────────────────────────────────────────────────────────────
export * from './bulletins'       // bulletins PDF (cache + métadonnées)

// ── Finance ──────────────────────────────────────────────────────────────────
export * from './finance'         // fee_types + invoices + payments

// ── Communication ────────────────────────────────────────────────────────────
export * from './messages'        // messages 1-to-1 + annonces + notifications

// ── Contenu vitrine ──────────────────────────────────────────────────────────
export * from './programs'        // programmes pédagogiques
export * from './news'            // articles d'actualité
