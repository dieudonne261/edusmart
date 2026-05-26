'use server'

import { createSupabaseServiceRoleClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

type SchoolRequestState = {
  error?: string
}

function clean(value: FormDataEntryValue | null) {
  return String(value ?? '').trim()
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

export async function submitSchoolRequest(
  _prev: SchoolRequestState,
  formData: FormData,
): Promise<SchoolRequestState> {
  const schoolName = clean(formData.get('school_name'))
  const slugWanted = normalizeSlug(clean(formData.get('slug_wanted')) || schoolName)
  const directorEmail = clean(formData.get('director_email')).toLowerCase()
  const directorFullName = clean(formData.get('director_full_name'))
  const directorPhone = clean(formData.get('director_phone'))
  const city = clean(formData.get('city'))
  const estimatedStudents = Number(clean(formData.get('estimated_students')))
  const notes = clean(formData.get('notes'))

  if (!schoolName || !slugWanted || !directorEmail || !city) {
    return { error: 'Nom de l\'ecole, sous-domaine, email et ville sont requis.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(directorEmail)) {
    return { error: 'Adresse email invalide.' }
  }

  const supabase = createSupabaseServiceRoleClient()
  const { error } = await supabase.from('school_requests').insert({
    school_name: schoolName,
    slug_wanted: slugWanted,
    director_email: directorEmail,
    director_full_name: directorFullName || null,
    director_phone: directorPhone || null,
    city,
    estimated_students: Number.isFinite(estimatedStudents) ? estimatedStudents : null,
    notes: notes || null,
    status: 'new',
  })

  if (error) {
    console.error('[vitrine/inscription] school_requests insert failed', error)
    return { error: 'Impossible d\'envoyer la demande pour le moment.' }
  }

  redirect(`/inscription/merci?school=${encodeURIComponent(slugWanted)}`)
}
