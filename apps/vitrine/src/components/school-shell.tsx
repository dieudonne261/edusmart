/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SCHOOL SHELL — Layout commun de toutes les pages école de la vitrine
 * ─────────────────────────────────────────────────────────────────────────────
 *  Reçoit un `OrganizationRow` Supabase (vs ancien type mock).
 *  Theming dynamique via CSS variables --school-primary/secondary/surface.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Tables } from '@edusmart/shared'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { schoolHref } from '@/lib/tenant'

type OrganizationRow = Tables<'organizations'>

type SchoolShellProps = {
  school: OrganizationRow
  isLocal: boolean
  active?: 'home' | 'about' | 'programs' | 'news' | 'contact'
  children: ReactNode
}

const navItems = [
  { id: 'home', label: 'Accueil', href: '/' },
  { id: 'about', label: 'À propos', href: '/about' },
  { id: 'programs', label: 'Programmes', href: '/programs' },
  { id: 'news', label: 'Actualités', href: '/news' },
  { id: 'contact', label: 'Contact', href: '/contact' },
] as const

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function getColors(colors: OrganizationRow['colors']) {
  const c = (colors ?? {}) as { primary?: string; secondary?: string; surface?: string }
  return {
    primary: c.primary ?? '#1A4D3A',
    secondary: c.secondary ?? '#C9A84C',
    surface: c.surface ?? '#FAFAF8',
  }
}

export function SchoolShell({ school, isLocal, active = 'home', children }: SchoolShellProps) {
  const colors = getColors(school.colors)
  const initials = getInitials(school.name)

  const shellStyle = {
    '--school-primary': colors.primary,
    '--school-secondary': colors.secondary,
    '--school-surface': colors.surface,
  } as CSSProperties

  return (
    <div style={shellStyle} className="min-h-screen bg-[var(--school-surface)]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link
            href={schoolHref('/', school.slug, isLocal)}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--school-primary)] text-sm font-bold text-white">
              {initials}
            </span>
            <span>
              <span className="block text-base font-bold text-slate-950">
                {school.name}
              </span>
              <span className="block text-sm text-slate-500">{school.city ?? ''}</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={schoolHref(item.href, school.slug, isLocal)}
                className={
                  item.id === active
                    ? 'rounded-md bg-[var(--school-primary)] px-3 py-2 font-semibold text-white'
                    : 'rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-bold text-slate-950">{school.name}</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {school.description ?? school.tagline ?? ''}
            </p>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-950">Coordonnées</p>
            <p className="mt-2">{school.address ?? '—'}</p>
            <p>{school.phone ?? '—'}</p>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-950">EduSmart</p>
            <p className="mt-2">{school.email ?? 'contact@edusmart.site'}</p>
            <p>Multi-écoles par sous-domaine</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
