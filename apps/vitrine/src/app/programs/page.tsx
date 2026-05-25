/**
 * /programs — Programmes pédagogiques de l'école.
 * Mode root → présentation des modules EduSmart.
 */
import { listProgramsByOrganization } from '@edusmart/shared'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export const revalidate = 60

export default async function ProgramsPage() {
  const tenant = await getTenantContext()

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase text-green-deep">Architecture</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Modules EduSmart</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Vitrine multi-écoles',
              'Admin web (direction & secrétariat)',
              'Académique : notes, bulletins, devoirs',
              'IA pédagogique (OpenRouter)',
              'App mobile parents/élèves (Expo)',
              'App enfants gamifiée (Expo)',
              'Desktop secrétariat offline (Electron + SQLite)',
              'Multi-tenancy par sous-domaine + RLS Supabase',
            ].map((m) => (
              <article key={m} className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-bold text-slate-950">{m}</h2>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const programs = await listProgramsByOrganization(tenant.school.id)

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="programs">
      <main className="mx-auto max-w-7xl px-5 py-12">
        <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
          Programmes
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Parcours de {tenant.school.name}
        </h1>

        {programs.length === 0 ? (
          <p className="mt-10 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Aucun programme publié pour cette école pour le moment.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {programs.map((program) => (
              <article
                key={program.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-slate-950">{program.title}</h2>
                  {program.duration && (
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {program.duration}
                    </span>
                  )}
                </div>
                {program.level && (
                  <p className="mt-2 text-sm font-semibold text-[var(--school-primary)]">
                    {program.level}
                  </p>
                )}
                {program.description && (
                  <p className="mt-3 leading-7 text-slate-600">{program.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </SchoolShell>
  )
}
