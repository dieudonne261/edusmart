import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export default function SettingsPage() {
  const tenant = getAdminTenant()

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="settings"
    >
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">
            Tenant
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Parametres ecole
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ['Slug', tenant.school.slug],
              ['Nom', tenant.school.name],
              ['Ville', tenant.school.city],
              ['Email', tenant.school.email],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-slate-950">{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">
            Vitrine
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Identite visuelle
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ['Primaire', tenant.school.colors.primary],
              ['Secondaire', tenant.school.colors.secondary],
              ['Surface', tenant.school.colors.surface],
            ].map(([label, color]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div
                  className="h-14 rounded-md border border-slate-200"
                  style={{ backgroundColor: color }}
                />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {label}
                </p>
                <p className="mt-1 font-mono text-sm text-slate-950">{color}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  )
}
