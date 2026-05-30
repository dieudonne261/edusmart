/**
 * ---------------------------------------------------------------------------
 *  / - Page d'accueil dual-mode (marketing root OU vitrine école)
 * ---------------------------------------------------------------------------
 *  - edusmart.site                -> mode 'root' (marketing global)
 *  - <slug>.edusmart.site         -> mode 'school' (vitrine de cette école)
 *
 *  Toutes les données viennent de Supabase (helpers @edusmart/shared/db).
 *  ISR 60s pour les pages publiques : modifs en DB visibles sous 1 minute
 *  sans rebuild.
 * ---------------------------------------------------------------------------
 */

import {
  listOrganizations,
  listProgramsByOrganization,
  listPublishedNews,
} from '@edusmart/shared'
import Image from 'next/image'
import Link from 'next/link'
import { RootMarketingClient } from '@/components/root-marketing-client'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext, schoolHref } from '@/lib/tenant'

export const revalidate = 60

export default async function HomePage() {
  const tenant = await getTenantContext()

  if (tenant.mode === 'root') {
    const schools = await listOrganizations()
    return <RootMarketingClient schoolsCount={schools.length} isLocal={tenant.isLocal} />
  }

  const [programs, news] = await Promise.all([
    listProgramsByOrganization(tenant.school.id),
    listPublishedNews(tenant.school.id, 3),
  ])

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="home">
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
                {tenant.school.tagline ?? tenant.school.description ?? ''}
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
                src={
                  tenant.school.banner_url ??
                  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1400'
                }
                alt={`Bannière ${tenant.school.name}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {programs.length > 0 && (
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
                    {program.level ?? ''}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {program.description ?? ''}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {news.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-10">
            <div className="rounded-lg bg-[var(--school-primary)] px-6 py-8 text-white md:px-8">
              <p className="text-sm font-semibold uppercase text-white/80">Actualités</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {news.slice(0, 2).map((article) => (
                  <article key={article.id} className="border-t border-white/20 pt-4">
                    <p className="text-sm text-white/70">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('fr-FR')
                        : ''}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">{article.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {article.excerpt ?? ''}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </SchoolShell>
  )
}
