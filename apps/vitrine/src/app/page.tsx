import {
  ORGANIZATIONS,
  getNewsByOrganizationId,
  getProgramsByOrganizationId,
} from '@edusmart/shared'
import Image from 'next/image'
import Link from 'next/link'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext, schoolHref } from '@/lib/tenant'

export default function HomePage() {
  const tenant = getTenantContext()

  if (tenant.mode === 'root') {
    return <RootMarketing isLocal={tenant.isLocal} />
  }

  const programs = getProgramsByOrganizationId(tenant.school.id)
  const news = getNewsByOrganizationId(tenant.school.id)

  return (
    <SchoolShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="home"
    >
      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
                Vitrine officielle
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
                {tenant.school.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {tenant.school.tagline}. EduSmart centralise les informations
                utiles pour les familles, les inscriptions et le suivi
                numerique de l&apos;etablissement.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={schoolHref('/contact', tenant.school.slug, tenant.isLocal)}
                  className="rounded-md bg-[var(--school-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Inscrire mon enfant
                </Link>
                <Link
                  href={schoolHref('/programs', tenant.school.slug, tenant.isLocal)}
                  className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Voir les programmes
                </Link>
              </div>
            </div>
            <div className="relative h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1400"
                alt="Salle de classe lumineuse avec des eleves en apprentissage"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Eleves', tenant.school.stats.students],
            ['Enseignants', tenant.school.stats.teachers],
            ['Reussite', `${tenant.school.stats.successRate}%`],
            ['Programmes', tenant.school.stats.programs],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
                Parcours
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Programmes disponibles
              </h2>
            </div>
            <Link
              href={schoolHref('/programs', tenant.school.slug, tenant.isLocal)}
              className="text-sm font-semibold text-[var(--school-primary)]"
            >
              Tous les programmes
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {programs.map((program) => (
              <article
                key={program.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <p className="text-sm font-semibold text-[var(--school-primary)]">
                  {program.level}
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {program.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="rounded-lg bg-[var(--school-primary)] px-6 py-8 text-white md:px-8">
            <p className="text-sm font-semibold uppercase text-white/80">
              Actualites
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {news.slice(0, 2).map((article) => (
                <article key={article.id} className="border-t border-white/20 pt-4">
                  <p className="text-sm text-white/70">{article.category}</p>
                  <h3 className="mt-2 text-xl font-bold">{article.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {article.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SchoolShell>
  )
}

function RootMarketing({ isLocal }: { isLocal: boolean }) {
  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-green-deep text-sm font-bold text-white">
              ES
            </span>
            <div>
              <p className="font-bold text-slate-950">EduSmart</p>
              <p className="text-sm text-slate-500">Plateforme multi-ecoles</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ORGANIZATIONS.map((school) => (
              <Link
                key={school.id}
                href={schoolHref('/', school.slug, isLocal)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {school.slug}.edusmart.site
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-green-deep">
              Systeme integre de gouvernance scolaire
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
              EduSmart centralise les vitrines, l&apos;admin et le suivi
              academique des ecoles.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Cette base locale prepare les prochaines phases : Supabase,
              authentification, IA OpenRouter, mobile Expo et desktop offline.
            </p>
          </div>
          <div className="relative h-[340px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=1400"
              alt="Espace d'apprentissage collaboratif"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3">
        {[
          ['Multi-ecoles', 'Chaque ecole garde ses donnees, couleurs et pages.'],
          ['Vitrine publique', 'Programmes, actualites, contact et admissions.'],
          ['Admin prepare', 'Dashboard, eleves, notes et outils IA en mock.'],
        ].map(([title, text]) => (
          <article
            key={title}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
