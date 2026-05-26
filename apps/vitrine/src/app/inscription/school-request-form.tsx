'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitSchoolRequest } from './actions'

const initialState: { error?: string } = {}

export function SchoolRequestForm() {
  const [state, action] = useFormState(submitSchoolRequest, initialState)

  return (
    <form action={action} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase text-[#1A4D3A]">Nouvelle ecole</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Informations de lancement</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ces donnees alimentent la table Supabase <code>school_requests</code>.
        </p>
      </div>

      {state.error && (
        <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Nom de l'ecole" name="school_name" required />
        <Field label="Sous-domaine souhaite" name="slug_wanted" placeholder="uaz" required />
        <Field label="Nom du directeur" name="director_full_name" />
        <Field label="Email du directeur" name="director_email" type="email" required />
        <Field label="Telephone" name="director_phone" />
        <Field label="Ville" name="city" required />
        <Field label="Nombre d'eleves estime" name="estimated_students" type="number" />
        <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
          Notes
          <textarea
            name="notes"
            rows={4}
            placeholder="Contexte, niveaux, besoin prioritaire..."
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#1A4D3A] focus:ring-2 focus:ring-[#1A4D3A]/15"
          />
        </label>
      </div>

      <SubmitButton />
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 block h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-[#1A4D3A] focus:ring-2 focus:ring-[#1A4D3A]/15"
      />
    </label>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#1A4D3A] px-5 text-sm font-semibold text-white transition hover:bg-[#143d2e] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Envoi en cours...' : 'Envoyer la demande'}
    </button>
  )
}
