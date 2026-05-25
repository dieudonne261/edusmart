import type { Organization } from '@edusmart/shared'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { schoolHref } from '@/lib/tenant'

type SchoolShellProps = {
  school: Organization
  isLocal: boolean
  active?: 'home' | 'about' | 'programs' | 'news' | 'contact'
  children: ReactNode
}

const navItems = [
  { id: 'home', label: 'Accueil', href: '/' },
  { id: 'about', label: 'A propos', href: '/about' },
  { id: 'programs', label: 'Programmes', href: '/programs' },
  { id: 'news', label: 'Actualites', href: '/news' },
  { id: 'contact', label: 'Contact', href: '/contact' },
] as const

export function SchoolShell({
  school,
  isLocal,
  active = 'home',
  children,
}: SchoolShellProps) {
  const shellStyle = {
    '--school-primary': school.colors.primary,
    '--school-secondary': school.colors.secondary,
    '--school-surface': school.colors.surface,
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
              {school.logoInitials}
            </span>
            <span>
              <span className="block text-base font-bold text-slate-950">
                {school.name}
              </span>
              <span className="block text-sm text-slate-500">{school.city}</span>
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
              {school.description}
            </p>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-950">Coordonnees</p>
            <p className="mt-2">{school.address}</p>
            <p>{school.phone}</p>
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-950">EduSmart</p>
            <p className="mt-2">{school.email}</p>
            <p>Multi-ecoles par sous-domaine</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
