/**
 * /news — Liste des actualités publiées de l'école courante.
 * Mode root → message générique.
 */
import { listPublishedNews } from '@edusmart/shared'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export const revalidate = 60

export default async function NewsPage() {
  const tenant = await getTenantContext()

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">Actualités</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Chaque école publie ses propres actualités sur son sous-domaine.
          </h1>
          <p className="mt-4 text-slate-600">
            Va sur <code>strelitzia.edusmart.site/news</code> ou{' '}
            <code>uaz.edusmart.site/news</code> pour les voir.
          </p>
        </section>
      </main>
    )
  }

  const news = await listPublishedNews(tenant.school.id, 30)

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="news">
      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
          Actualités
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          La vie à {tenant.school.name}
        </h1>

        {news.length === 0 ? (
          <p className="mt-10 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Aucune actualité publiée pour le moment.
          </p>
        ) : (
          <ul className="mt-10 space-y-6">
            {news.map((article) => (
              <li
                key={article.id}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <p className="text-xs text-slate-400">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{article.title}</h2>
                {article.excerpt && (
                  <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </SchoolShell>
  )
}
