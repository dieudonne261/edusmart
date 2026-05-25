/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  /admin — Dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 *  Données réelles depuis Supabase (RLS scoped à l'organisation du user).
 *
 *  Compteurs :
 *    - Élèves actifs
 *    - Classes ouvertes (année courante)
 *    - Moyenne générale (à partir des `students.average` non null)
 *    - Notes saisies (count grades)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient, getCurrentAcademicYear, type Tables } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

type StudentRow = Tables<'students'>

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const tenant = await getAdminTenant()
  const supabase = createSupabaseServerClient()

  // Requêtes parallèles pour minimiser la latence
  const [studentsRes, classesRes, currentYear, gradesRes] = await Promise.all([
    supabase
      .from('students')
      .select('*')
      .eq('organization_id', tenant.school.id)
      .order('last_name'),
    supabase
      .from('classes')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', tenant.school.id),
    getCurrentAcademicYear(tenant.school.id),
    supabase
      .from('grades')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', tenant.school.id),
  ])

  const students: StudentRow[] = studentsRes.data ?? []
  const classesCount = classesRes.count ?? 0
  const gradesCount = gradesRes.count ?? 0

  const studentsWithAverage = students.filter((s) => s.average != null)
  const generalAverage =
    studentsWithAverage.length === 0
      ? 0
      : studentsWithAverage.reduce((sum, s) => sum + Number(s.average ?? 0), 0) /
        studentsWithAverage.length

  const watchList = students.filter((s) => s.status === 'watch')
  const activeCount = students.filter(
    (s) => s.status === 'active' || s.status === 'watch',
  ).length

  const kpis: Array<[string, string | number]> = [
    ['Élèves actifs', activeCount],
    ['Classes ouvertes', classesCount],
    ['Moyenne générale', generalAverage > 0 ? generalAverage.toFixed(1) : '—'],
    ['Notes saisies', gradesCount],
  ]

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="dashboard"
      userFullName={tenant.profile.full_name}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <article
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">Liste des élèves</h2>
            <span className="text-xs text-slate-400">
              {currentYear ? `Année ${currentYear.name}` : 'Aucune année active'}
            </span>
          </div>
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Aucun élève enregistré pour cette école.
              </div>
            ) : (
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Élève</th>
                    <th className="px-5 py-3 font-semibold">Moyenne</th>
                    <th className="px-5 py-3 font-semibold">Présence</th>
                    <th className="px-5 py-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t border-slate-100">
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {student.student_code}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-950">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {student.average != null ? `${student.average}/20` : '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {student.attendance_rate != null ? `${student.attendance_rate}%` : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={student.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">Alertes prioritaires</h2>
            <div className="mt-4 space-y-3">
              {watchList.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune alerte active. 🎉</p>
              ) : (
                watchList.map((student) => (
                  <div
                    key={student.id}
                    className="rounded-md border border-amber-200 bg-amber-50 p-3"
                  >
                    <p className="font-semibold text-amber-950">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      Moyenne {student.average ?? '—'}/20 · présence{' '}
                      {student.attendance_rate ?? '—'}%
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">Compte connecté</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Rôle</dt>
                <dd className="font-bold text-slate-950">{tenant.profile.role}</dd>
              </div>
              <div>
                <dt className="text-slate-500">École</dt>
                <dd className="font-bold text-slate-950">{tenant.slug}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </AdminShell>
  )
}

function StatusBadge({ status }: { status: string | null }) {
  const variants: Record<string, string> = {
    active: 'bg-green-50 text-green-800',
    watch: 'bg-amber-50 text-amber-800',
    inactive: 'bg-slate-100 text-slate-700',
    graduated: 'bg-blue-50 text-blue-800',
    transferred: 'bg-purple-50 text-purple-800',
  }
  const label: Record<string, string> = {
    active: 'Actif',
    watch: 'À suivre',
    inactive: 'Inactif',
    graduated: 'Diplômé',
    transferred: 'Transféré',
  }
  const key = status ?? 'active'
  return (
    <span className={`rounded-md px-2 py-1 font-semibold ${variants[key] ?? variants.active}`}>
      {label[key] ?? key}
    </span>
  )
}
