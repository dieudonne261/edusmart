import {
  calculateAverage,
  getGradesByOrganizationId,
  getStudentsByOrganizationId,
} from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export default function GradesPage() {
  const tenant = getAdminTenant()
  const students = getStudentsByOrganizationId(tenant.school.id)
  const grades = getGradesByOrganizationId(tenant.school.id)

  return (
    <AdminShell school={tenant.school} isLocal={tenant.isLocal} active="grades">
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">
            Moyennes
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Calcul pondere par eleve
          </h2>
          <div className="mt-5 space-y-3">
            {students.map((student) => {
              const studentGrades = grades.filter(
                (grade) => grade.studentId === student.id,
              )
              const average = calculateAverage(studentGrades)

              return (
                <article
                  key={student.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {student.className}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-950">
                      {average.toFixed(1)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Notes saisies
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Eleve</th>
                  <th className="px-5 py-3 font-semibold">Matiere</th>
                  <th className="px-5 py-3 font-semibold">Note</th>
                  <th className="px-5 py-3 font-semibold">Coefficient</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => {
                  const student = students.find(
                    (item) => item.id === grade.studentId,
                  )

                  return (
                    <tr key={grade.id} className="border-t border-slate-100">
                      <td className="px-5 py-3 font-semibold text-slate-950">
                        {student
                          ? `${student.firstName} ${student.lastName}`
                          : 'Eleve inconnu'}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {grade.subject}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {grade.score}/{grade.maxScore}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {grade.coefficient ?? 1}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}
