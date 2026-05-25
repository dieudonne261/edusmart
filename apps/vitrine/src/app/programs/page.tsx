import { getProgramsByOrganizationId } from '@edusmart/shared'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export default function ProgramsPage() {
  const tenant = getTenantContext()
  const programs = getProgramsByOrganizationId(tenant.school.id)

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase text-green-deep">
            Architecture
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Modules EduSmart prevus
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Site vitrine multi-ecoles',
              'Admin web et RH',
              'Academique, notes et bulletins',
              'IA, recommandations et quiz',
            ].map((moduleName) => (
              <article
                key={moduleName}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <h2 className="font-bold text-slate-950">{moduleName}</h2>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <SchoolShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="programs"
    >
      <main className="mx-auto max-w-7xl px-5 py-12">
        <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
          Programmes
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Parcours de {tenant.school.name}
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-slate-950">
                  {program.title}
                </h2>
                <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {program.duration}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--school-primary)]">
                {program.level}
              </p>
              <p className="mt-3 leading-7 text-slate-600">
                {program.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {program.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </SchoolShell>
  )
}
