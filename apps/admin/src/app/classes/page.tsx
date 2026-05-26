import { listClassesByOrganization } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { Badge, Button, Card, CardContent, CardHeader } from '@/components/ui'
import { getAdminTenant } from '@/lib/admin-tenant'

export const dynamic = 'force-dynamic'

type ClassItem = Awaited<ReturnType<typeof listClassesByOrganization>>[number] & {
  enrollments?: Array<{ count: number }>
  homeroom_teacher?: { full_name: string | null; avatar_url: string | null } | null
}

export default async function ClassesPage() {
  const tenant = await getAdminTenant()
  const classes = (await listClassesByOrganization(tenant.school.id)) as ClassItem[]
  const totalStudents = classes.reduce(
    (sum, item) => sum + Number(item.enrollments?.[0]?.count ?? 0),
    0,
  )
  const filledCapacity = classes.reduce((sum, item) => sum + Number(item.capacity ?? 0), 0)

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="classes"
      userFullName={tenant.profile.full_name}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Classes ouvertes" value={classes.length} />
        <StatCard label="Eleves affectes" value={totalStudents} />
        <StatCard label="Capacite totale" value={filledCapacity || '-'} />
      </section>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Classes</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Organisation pedagogique de {tenant.school.name}
            </h2>
          </div>
          <Button variant="secondary" type="button">Nouvelle classe</Button>
        </CardHeader>

        <CardContent>
          {classes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold text-slate-950">Aucune classe publiee</p>
              <p className="mt-2 text-sm text-slate-500">
                Creez une annee academique active puis ajoutez les classes de l&apos;ecole.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {classes.map((item) => {
                const count = Number(item.enrollments?.[0]?.count ?? 0)
                const capacity = Number(item.capacity ?? 0)
                const fillRate = capacity > 0 ? Math.round((count / capacity) * 100) : null

                return (
                  <article
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
                          {item.level && <Badge>{item.level}</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.grade_level ?? 'Niveau non renseigne'}
                          {item.section ? ` · Section ${item.section}` : ''}
                          {item.room ? ` · Salle ${item.room}` : ''}
                        </p>
                      </div>
                      <Badge className="bg-white text-slate-700">
                        {count}{capacity ? `/${capacity}` : ''} eleves
                      </Badge>
                    </div>

                    {fillRate !== null && (
                      <div className="mt-4">
                        <div className="h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-[var(--school-primary)]"
                            style={{ width: `${Math.min(fillRate, 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-500">
                          Taux de remplissage {fillRate}%
                        </p>
                      </div>
                    )}

                    <div className="mt-4 rounded-md bg-white p-3 text-sm">
                      <p className="font-semibold text-slate-500">Responsable</p>
                      <p className="mt-1 font-bold text-slate-950">
                        {item.homeroom_teacher?.full_name ?? 'A assigner'}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  )
}
