import type { Organization } from '@edusmart/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { adminHref } from '@/lib/admin-tenant'

type AdminShellProps = {
  school: Organization
  isLocal: boolean
  active: 'dashboard' | 'students' | 'grades' | 'ai-tools' | 'settings'
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'students', label: 'Eleves', href: '/students' },
  { id: 'grades', label: 'Notes', href: '/grades' },
  { id: 'ai-tools', label: 'IA', href: '/ai-tools' },
  { id: 'settings', label: 'Reglages', href: '/settings' },
] as const

export function AdminShell({
  school,
  isLocal,
  active,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 text-white lg:block">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-sm font-bold text-slate-950">
              {school.logoInitials}
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
              Direction demo - {school.city}
            </div>
          </div>
        </header>

        <main className="px-5 py-6">{children}</main>
      </div>
    </div>
  )
}
