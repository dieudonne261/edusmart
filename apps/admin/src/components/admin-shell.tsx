/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ADMIN SHELL — Layout commun de toutes les pages /admin
 * ─────────────────────────────────────────────────────────────────────────────
 *  Adapté pour consommer un `OrganizationRow` venu de Supabase (et non plus
 *  l'ancien type `Organization` des mocks).
 *  - `logoInitials` est calculé à la volée depuis le nom.
 *  - `colors` est typé `Json` → on cast en { primary, secondary, surface }.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Tables } from '@edusmart/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { adminHref } from '@/lib/admin-tenant'
import { signOut } from '@/app/login/actions'

type OrganizationRow = Tables<'organizations'>

type AdminShellProps = {
  school: OrganizationRow
  isLocal: boolean
  active: 'dashboard' | 'students' | 'grades' | 'ai-tools' | 'settings' | 'classes'
  userFullName?: string | null
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'classes',   label: 'Classes',   href: '/classes' },
  { id: 'students',  label: 'Élèves',    href: '/students' },
  { id: 'grades',    label: 'Notes',     href: '/grades' },
  { id: 'ai-tools',  label: 'IA',        href: '/ai-tools' },
  { id: 'settings',  label: 'Réglages',  href: '/settings' },
] as const

/** Calcule des initiales à 2 caractères à partir du nom de l'école. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

/** Parse les couleurs JSONB en objet typé, avec fallback EduSmart. */
function getColors(colors: OrganizationRow['colors']) {
  const c = (colors ?? {}) as { primary?: string; secondary?: string; surface?: string }
  return {
    primary: c.primary ?? '#1A4D3A',
    secondary: c.secondary ?? '#C9A84C',
    surface: c.surface ?? '#FAFAF8',
  }
}

export function AdminShell({
  school,
  isLocal,
  active,
  userFullName,
  children,
}: AdminShellProps) {
  const colors = getColors(school.colors)
  const initials = getInitials(school.name)

  return (
    <div
      className="min-h-screen bg-slate-100"
      style={{
        ['--school-primary' as string]: colors.primary,
        ['--school-secondary' as string]: colors.secondary,
      }}
    >
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 text-white lg:block">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold text-slate-950"
              style={{ background: 'var(--school-secondary)' }}
            >
              {initials}
            </span>
            <div>
              <p className="font-bold">{school.name}</p>
              <p className="text-sm text-slate-400">Portail admin</p>
            </div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={adminHref(item.href, school.slug, isLocal)}
              className={
                item.id === active
                  ? 'block rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950'
                  : 'block rounded-md px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
          {userFullName && (
            <p className="px-3 pb-2 text-xs text-slate-400">
              Connecté : <span className="text-white">{userFullName}</span>
            </p>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-slate-500">
                EduSmart Admin
              </p>
              <h1 className="text-2xl font-bold text-slate-950">{school.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={adminHref(item.href, school.slug, isLocal)}
                  className={
                    item.id === active
                      ? 'rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white'
                      : 'rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700'
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
              {school.city ?? 'École'} · slug : {school.slug}
            </div>
          </div>
        </header>

        <main className="px-5 py-6">{children}</main>
      </div>
    </div>
  )
}
