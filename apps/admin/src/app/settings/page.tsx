/**
 * /admin/settings — Réglages de l'école (lecture seule pour l'instant).
 * L'édition arrivera plus tard (Server Actions + upload logo Supabase Storage).
 */
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export const dynamic = 'force-dynamic'

/** Parse les couleurs JSONB avec fallback EduSmart. */
function getColors(colors: unknown) {
  const c = (colors ?? {}) as { primary?: string; secondary?: string; surface?: string }
  return {
    primary: c.primary ?? '#1A4D3A',
    secondary: c.secondary ?? '#C9A84C',
    surface: c.surface ?? '#FAFAF8',
  }
}

export default async function SettingsPage() {
  const tenant = await getAdminTenant()
  const colors = getColors(tenant.school.colors)

  const infos: Array<[string, string | null | undefined]> = [
    ['Slug', tenant.school.slug],
    ['Nom', tenant.school.name],
    ['Ville', tenant.school.city],
    ['Région', tenant.school.region],
    ['Pays', tenant.school.country],
    ['Email', tenant.school.email],
    ['Téléphone', tenant.school.phone],
    ['Adresse', tenant.school.address],
    ['Site web', tenant.school.website],
    ['Plan', tenant.school.plan],
    ['Statut', tenant.school.status],
  ]

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="settings"
      userFullName={tenant.profile.full_name}
    >
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">École</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">Informations générales</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {infos.map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-slate-950">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">Vitrine</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">Identité visuelle</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(
              [
                ['Primaire', colors.primary],
                ['Secondaire', colors.secondary],
                ['Surface', colors.surface],
              ] as const
            ).map(([label, color]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-4">
                <div
                  className="h-14 rounded-md border border-slate-200"
                  style={{ backgroundColor: color }}
                />
                <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 font-mono text-sm text-slate-950">{color}</p>
              </div>
            ))}
          </div>

          {tenant.school.logo_url && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-500">Logo actuel</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tenant.school.logo_url}
                alt={`Logo ${tenant.school.name}`}
                className="mt-2 h-20 rounded-md border border-slate-200 object-contain p-2"
              />
            </div>
          )}
        </article>
      </section>
    </AdminShell>
  )
}
