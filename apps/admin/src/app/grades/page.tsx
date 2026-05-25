/**
 * /admin/grades — Liste des notes saisies (lecture seule pour l'instant)
 * La saisie interactive arrivera dans STEP_06 avec Server Action `recordGrade`.
 */
import { createSupabaseServerClient } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export const dynamic = 'force-dynamic'

export default async function GradesPage() {
  const tenant = await getAdminTenant()
  const supabase = createSupabaseServerClient()

  const { data: grades } = await supabase
    .from('grades')
    .select(`
      id, value, max_value, coefficient, evaluation_type, title, recorded_at,
      student:students(first_name, last_name),
      subject:subjects(name, color),
      period:academic_periods(name)
    `)
    .eq('organization_id', tenant.school.id)
    .order('recorded_at', { ascending: false })
    .limit(100)

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="grades"
      userFullName={tenant.profile.full_name}
    >
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">Notes</p>
          <h2 className="text-xl font-bold text-slate-950">
            {grades?.length ?? 0} note{(grades?.length ?? 0) > 1 ? 's' : ''} saisie
            {(grades?.length ?? 0) > 1 ? 's' : ''} récemment
          </h2>
        </div>
        <div className="overflow-x-auto">
          {!grades || grades.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Aucune note saisie. Va dans une fiche élève pour en ajouter.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Élève</th>
                  <th className="px-5 py-3 font-semibold">Matière</th>
                  <th className="px-5 py-3 font-semibold">Période</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Note</th>
                  <th className="px-5 py-3 font-semibold">Coef</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g: any) => (
                  <tr key={g.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {g.recorded_at
                        ? new Date(g.recorded_at).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-950">
                      {g.student?.first_name} {g.student?.last_name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <span
                        className="rounded-md px-2 py-1 text-xs font-semibold"
                        style={{ background: `${g.subject?.color}22`, color: g.subject?.color }}
                      >
                        {g.subject?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {g.period?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {g.evaluation_type ?? '—'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-950">
                      {g.value}/{g.max_value}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{g.coefficient ?? 1}</td>
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
