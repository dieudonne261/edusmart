/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — Messages, Announcements, Notifications
 * ─────────────────────────────────────────────────────────────────────────────
 *  Trois canaux de communication distincts :
 *
 *  1. `messages`      : 1-to-1 entre deux utilisateurs (DM parent ↔ prof).
 *                       Supporte les threads via `parent_message_id`.
 *  2. `announcements` : broadcast d'un staff vers une classe ou toute l'école.
 *  3. `notifications` : événements système (nouvelle note, devoir, paiement).
 *                       Persistées + envoyées en push si l'utilisateur a un
 *                       token enregistré.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables, Inserts } from '../supabase'

export type MessageRow = Tables<'messages'>
export type AnnouncementRow = Tables<'announcements'>
export type NotificationRow = Tables<'notifications'>

/* ────────────────────────────────────────────────────────────────────────── */
/*  MESSAGES 1-to-1                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Boîte de réception de l'utilisateur courant. Récents en premier.
 * Joint le profil de l'expéditeur pour affichage UI.
 */
export async function listInbox(userId: string, limit = 50) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)')
    .eq('recipient_id', userId)
    .order('sent_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

/** Liste les messages d'un thread (parent + réponses), chronologiques. */
export async function getMessageThread(rootMessageId: string) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)')
    .or(`id.eq.${rootMessageId},parent_message_id.eq.${rootMessageId}`)
    .order('sent_at')
  return data ?? []
}

/** Envoie un message (la RLS vérifie que sender_id = auth.uid()). */
export async function sendMessage(payload: Inserts<'messages'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('messages')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Marque un message comme lu (champ `read_at`). */
export async function markMessageAsRead(messageId: string) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId)
  if (error) throw error
}

/** Compte les messages non lus de l'utilisateur courant (badge UI). */
export async function countUnreadMessages(userId: string) {
  const supabase = createSupabaseServerClient()
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .is('read_at', null)
  return count ?? 0
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  ANNONCES                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Annonces actuellement actives (publiées, non expirées) pour une école.
 * Si `classId` est fourni, ne renvoie que celles de cette classe + celles
 * adressées à toute l'école.
 */
export async function listActiveAnnouncements(organizationId: string, classId?: string) {
  const supabase = createSupabaseServerClient()
  const now = new Date().toISOString()
  let q = supabase
    .from('announcements')
    .select('*, author:profiles!announcements_author_id_fkey(full_name, avatar_url)')
    .eq('organization_id', organizationId)
    .lte('published_at', now)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order('published_at', { ascending: false })
  if (classId) {
    q = q.or(`class_id.is.null,class_id.eq.${classId}`)
  } else {
    q = q.is('class_id', null)
  }
  const { data } = await q
  return data ?? []
}

/** Crée une annonce (réservé staff). */
export async function createAnnouncement(payload: Inserts<'announcements'>) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('announcements')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  NOTIFICATIONS                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

/** Notifications de l'utilisateur courant (non lues en premier). */
export async function listNotifications(userId: string, limit = 30) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('read_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

/** Marque toutes les notifications de l'utilisateur comme lues. */
export async function markAllNotificationsRead(userId: string) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)
  if (error) throw error
}
