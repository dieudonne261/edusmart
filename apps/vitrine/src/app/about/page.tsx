import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export default function AboutPage() {
  const tenant = getTenantContext()

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">
            A propos
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            EduSmart est pense comme une plateforme SaaS pour plusieurs ecoles.
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Le projet pose les bases du memoire : gouvernance scolaire, suivi
            academique, isolement par organization_id, puis IA et applications
            mobiles dans les phases suivantes.
          </p>
        </section>
      </main>
    )
  }

  return (
    <SchoolShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="about"
    >
      <main className="mx-auto max-w-7xl px-5 py-12">
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
              Identite
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              {tenant.school.name}
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              {tenant.school.description}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Ville', tenant.school.city],
              ['Adresse', tenant.school.address],
              ['Email', tenant.school.email],
              ['Telephone', tenant.school.phone],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </SchoolShell>
  )
}
