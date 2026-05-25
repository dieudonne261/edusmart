'use client'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOGIN FORM (Client Component)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Formulaire interactif avec 3 onglets : Magic Link / Password / Google.
 *  Utilise `useFormState` + `useFormStatus` (React 19/Next 14) pour gérer
 *  l'état d'erreur sans `useState` manuel.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useFormState, useFormStatus } from 'react-dom'
import { useState } from 'react'
import {
  signInWithPassword,
  signInWithMagicLink,
  signInWithGoogle,
  type AuthActionResult,
} from './actions'

const initialState: AuthActionResult = {}

export function LoginForm({ schoolSlug }: { schoolSlug: string }) {
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [magicState, magicAction] = useFormState(signInWithMagicLink, initialState)
  const [pwdState, pwdAction] = useFormState(signInWithPassword, initialState)

  return (
    <div className="mt-6 space-y-4">
      {/* Switch entre Magic Link et Password */}
      <div className="flex rounded-md bg-slate-100 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('magic')}
          className={`flex-1 rounded ${mode === 'magic' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500'} py-2`}
        >
          Magic Link
        </button>
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 rounded ${mode === 'password' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500'} py-2`}
        >
          Mot de passe
        </button>
      </div>

      {mode === 'magic' ? (
        <form action={magicAction} className="space-y-3">
          <Label>Email</Label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ton.email@exemple.com"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <SubmitButton label="Recevoir le lien" />
          {magicState.error && <ErrorMsg>{magicState.error}</ErrorMsg>}
          {magicState.info && <InfoMsg>{magicState.info}</InfoMsg>}
        </form>
      ) : (
        <form action={pwdAction} className="space-y-3">
          <Label>Email</Label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <Label>Mot de passe</Label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <SubmitButton label="Se connecter" />
          {pwdState.error && <ErrorMsg>{pwdState.error}</ErrorMsg>}
        </form>
      )}

      {/* Séparateur */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        ou
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google OAuth — pas de formulaire car redirect externe */}
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <GoogleIcon /> Continuer avec Google
        </button>
      </form>

      <input type="hidden" name="school" value={schoolSlug} />
    </div>
  )
}

/* ─── UI primitives ──────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700">{children}</label>
}
function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p>
  )
}
function InfoMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{children}</p>
  )
}
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      style={{ background: 'var(--school-primary)' }}
    >
      {pending ? 'En cours…' : label}
    </button>
  )
}
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.7 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.2 0-9.7-3.3-11.3-8l-6.5 5A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.5l6.2 5.2c-.4.4 6.6-4.8 6.6-14.7 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  )
}
