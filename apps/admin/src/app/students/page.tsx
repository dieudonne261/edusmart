import { getStudentsByOrganizationId } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export default function StudentsPage() {
  const tenant = getAdminTenant()
  const students = getStudentsByOrganizationId(tenant.school.id)

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="students"
    >
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              Eleves
            </p>
            <h2 className="text-xl font-bold text-slate-950">
              Dossier scolaire
            </h2>
          </div>
          <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Nouvelle inscription
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Nom</th>
                <th className="px-5 py-3 font-semibold">Classe</th>
                <th className="px-5 py-3 font-semibold">Niveau</th>
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
                  <td className="px-5 py-3 text-slate-600">{student.level}</td>
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
                      {student.status === 'watch' ? 'A suivre' : 'Actif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  )
}
