/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Finance (frais scolaires, factures, paiements)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Trois tables :
 *
 *  1. `fee_types`         : modèles de frais (Inscription, Scolarité mensuelle,
 *                            Cantine, etc.) avec montant + récurrence.
 *  2. `student_invoices`  : factures émises pour un élève (instances d'un
 *                            fee_type pour une période donnée).
 *  3. `payments`          : versements (Mvola, cash, Orange Money, etc.)
 *                            rattachés à une facture.
 *
 *  Devise par défaut : MGA (Ariary). On supporte d'autres devises au cas par cas.
 *  Statuts facture : pending → partial → paid (ou overdue / cancelled).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'

export type FeeTypeRow = Tables<'fee_types'>
export type StudentInvoiceRow = Tables<'student_invoices'>
export type PaymentRow = Tables<'payments'>

/* ────────────────────────────────────────────────────────────────────────── */
/*  TYPES DE FRAIS                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

export async function listFeeTypes(organizationId: string): Promise<FeeTypeRow[]> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('fee_types')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('name')
  return data ?? []
}

export async function createFeeType(payload: Inserts<'fee_types'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('fee_types')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  FACTURES                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/** Factures d'un élève (parent en voit les siennes, staff voit tout). */
export async function listInvoicesByStudent(studentId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('student_invoices')
    .select('*, fee_type:fee_types(name, recurrence)')
    .eq('student_id', studentId)
    .order('due_date', { ascending: true, nullsFirst: false })
  return data ?? []
}

/** Crée une facture (typiquement depuis un fee_type + élève). */
export async function createInvoice(payload: Inserts<'student_invoices'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('student_invoices')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PAIEMENTS                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Enregistre un paiement et met à jour le statut + le montant payé sur la
 * facture associée. Si le total payé couvre le dû, la facture passe à `paid`.
 */
export async function recordPayment(payload: Inserts<'payments'>) {
  const supabase = createSupabaseServerClient()
  // 1. Insérer le paiement
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(payload)
    .select()
    .single()
  if (error) throw error

  // 2. Mettre à jour la facture liée
  if (payment.invoice_id) {
    const { data: inv } = await supabase
      .from('student_invoices')
      .select('amount_due, amount_paid')
      .eq('id', payment.invoice_id)
      .single()
    if (inv) {
      const newAmountPaid = Number(inv.amount_paid ?? 0) + Number(payment.amount)
      const newStatus =
        newAmountPaid >= Number(inv.amount_due) ? 'paid'
        : newAmountPaid > 0 ? 'partial'
        : 'pending'
      await supabase
        .from('student_invoices')
        .update({ amount_paid: newAmountPaid, status: newStatus })
        .eq('id', payment.invoice_id)
    }
  }
  return payment
}

/** Historique des paiements d'un élève. */
export async function listPaymentsByStudent(studentId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('payments')
    .select('*, invoice:student_invoices(fee_type:fee_types(name))')
    .eq('student_id', studentId)
    .order('paid_at', { ascending: false })
  return data ?? []
}
