/**
 * /admin/students — Liste des élèves de l'école courante
 * Lit via Supabase (RLS) toute la table students filtrée par tenant.
 */
import { createSupabaseServerClient, type Tables } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

type StudentRow = Tables<'students'>

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const tenant = await getAdminTenant()
  const supabase = createSupabaseServerClient()

  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('organization_id', tenant.school.id)
    .order('last_name')
  const students: StudentRow[] = data ?? []

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="students"
      userFullName={tenant.profile.full_name}
    >
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Élèves</p>
            <h2 className="text-xl font-bold text-slate-950">
              {students.length} élève{students.length > 1 ? 's' : ''} inscrit
              {students.length > 1 ? 's' : ''}
            </h2>
          </div>
          <button
            className="rounded-md px-4 py-2 text-sm font-semibold text-white"
            style={{ background: 'var(--school-primary)' }}
          >
            Nouvelle inscription
          </button>
        </div>
        <div className="overflow-x-auto">
          {students.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Aucun élève. Crée-en un via le bouton « Nouvelle inscription ».
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Code</th>
                  <th className="px-5 py-3 font-semibold">Nom</th>
                  <th className="px-5 py-3 font-semibold">Naissance</th>
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
                      {student.birth_date
                        ? new Date(student.birth_date).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {student.average != null ? `${student.average}/20` : '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {student.attendance_rate != null
                        ? `${student.attendance_rate}%`
                        : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          student.status === 'watch'
                            ? 'rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-800'
                            : 'rounded-md bg-green-50 px-2 py-1 font-semibold text-green-800'
                        }
                      >
                        {student.status === 'watch' ? 'À suivre' : 'Actif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminShell>
  )
}
