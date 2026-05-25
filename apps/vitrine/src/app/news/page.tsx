import { getNewsByOrganizationId } from '@edusmart/shared'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export default function NewsPage() {
  const tenant = getTenantContext()
  const news = getNewsByOrganizationId(tenant.school.id)

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">
            Actualites projet
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Les actualites seront separees par ecole apres connexion Supabase.
          </h1>
        </section>
      </main>
    )
  }

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="news">
      <main className="mx-auto max-w-7xl px-5 py-12">
        <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
          Actualites
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Dernieres nouvelles
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {news.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-[var(--school-primary)]">
                {article.category} - {article.publishedAt}
              </p>
              <h2 className="mt-3 text-xl font-bold text-slate-950">
                {article.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </main>
    </SchoolShell>
  )
}
