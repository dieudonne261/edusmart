import {
  getGradesByOrganizationId,
  getStaffByOrganizationId,
  getStudentsByOrganizationId,
} from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export default function AdminPage() {
  const tenant = getAdminTenant()
  const students = getStudentsByOrganizationId(tenant.school.id)
  const grades = getGradesByOrganizationId(tenant.school.id)
  const staff = getStaffByOrganizationId(tenant.school.id)
  const average =
    students.reduce((total, student) => total + student.average, 0) /
    Math.max(students.length, 1)
  const attendance =
    students.reduce((total, student) => total + student.attendanceRate, 0) /
    Math.max(students.length, 1)
  const watchedStudents = students.filter((student) => student.status === 'watch')

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="dashboard"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Eleves actifs', students.length],
          ['Personnel', staff.length],
          ['Moyenne generale', average.toFixed(1)],
          ['Presence', `${attendance.toFixed(0)}%`],
        ].map(([label, value]) => (
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
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Suivi academique
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Eleve</th>
                  <th className="px-5 py-3 font-semibold">Classe</th>
                  <th className="px-5 py-3 font-semibold">Moyenne</th>
                  <th className="px-5 py-3 font-semibold">Presence</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-semibold text-slate-950">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {student.className}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {student.average}/20
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {student.attendanceRate}%
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          student.status === 'watch'
                            ? 'rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-800'
                            : 'rounded-md bg-green-50 px-2 py-1 font-semibold text-green-800'
                        }
                      >
                        {student.status === 'watch' ? 'A suivre' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Alertes prioritaires
            </h2>
            <div className="mt-4 space-y-3">
              {watchedStudents.map((student) => (
                <div
                  key={student.id}
                  className="rounded-md border border-amber-200 bg-amber-50 p-3"
                >
                  <p className="font-semibold text-amber-950">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-1 text-sm text-amber-800">
                    Moyenne {student.average}/20 - presence{' '}
                    {student.attendanceRate}%
                  </p>
                </div>
              ))}
              {watchedStudents.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune alerte active.</p>
              ) : null}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Donnees chargees
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Notes</dt>
                <dd className="font-bold text-slate-950">{grades.length}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Tenant</dt>
                <dd className="font-bold text-slate-950">{tenant.slug}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </AdminShell>
  )
}
