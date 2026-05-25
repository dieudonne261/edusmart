/**
 * /about — Page "À propos" de l'école courante.
 * En mode root (edusmart.site), affiche la présentation de la plateforme.
 */
import { createSupabaseServerClient } from '@edusmart/shared'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export const revalidate = 60

export default async function AboutPage() {
  const tenant = await getTenantContext()

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">À propos</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            EduSmart est une plateforme SaaS multi-écoles
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Conçue pour les établissements scolaires de Madagascar puis d&apos;Afrique
            francophone, EduSmart centralise la gouvernance, la pédagogie et la
            communication parents en un seul produit web + mobile + desktop offline.
          </p>
        </section>
      </main>
    )
  }

  // Récupère l'équipe publiée pour l'école
  const supabase = createSupabaseServerClient()
  const { data: team } = await supabase
    .from('team_members')
    .select('*')
    .eq('organization_id', tenant.school.id)
    .eq('is_published', true)
    .order('display_order')

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="about">
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
              Identité
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              {tenant.school.name}
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              {tenant.school.description ?? tenant.school.tagline ?? ''}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ['Ville', tenant.school.city],
                ['Adresse', tenant.school.address],
                ['Email', tenant.school.email],
                ['Téléphone', tenant.school.phone],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 font-bold text-slate-950">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </section>

        {team && team.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-950">L&apos;équipe</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <article
                  key={m.id}
                  className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4"
                >
                  {m.avatar_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.avatar_url}
                      alt={m.full_name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--school-primary)] text-white">
                      {m.full_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-950">{m.full_name}</h3>
                    <p className="text-sm text-slate-500">{m.role ?? ''}</p>
                    {m.bio && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">{m.bio}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </SchoolShell>
  )
}
