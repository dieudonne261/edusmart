/**
 * /admin/ai-tools — Outils IA admin (catalogue + prompt rapide stubby).
 * La génération réelle via OpenRouter arrivera dans STEP_07.
 */
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export const dynamic = 'force-dynamic'

const TOOLS = [
  { id: 'lesson',      title: 'Générer une leçon',           description: 'Plan de cours structuré pour une matière + un niveau.' },
  { id: 'quiz',        title: 'Générer un quiz',              description: 'QCM 10 questions au format JSON, prêt à publier.' },
  { id: 'appraisal',   title: 'Appréciations bulletin',       description: '3 variantes (bienveillante / factuelle / motivante).' },
  { id: 'analysis',    title: 'Analyse de classe',            description: 'Forces, faiblesses, élèves à risque + recommandations.' },
  { id: 'parent_comm', title: 'Communication aux parents',    description: 'Court message bienveillant et précis.' },
  { id: 'risk',        title: 'Détection du décrochage',      description: 'Score de risque (0-100) + facteurs principaux.' },
]

export default async function AiToolsPage() {
  const tenant = await getAdminTenant()

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="ai-tools"
      userFullName={tenant.profile.full_name}
    >
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold uppercase text-slate-500">OpenRouter</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">Outils IA admin</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          Ces outils seront connectés à l&apos;API OpenRouter dans STEP_07.
          Pour l&apos;instant ils servent à valider l&apos;UI et la liste.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.id}
              className="rounded-lg border border-slate-200 p-4 hover:border-slate-300"
            >
              <h3 className="font-bold text-slate-950">{tool.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{tool.description}</p>
              <span className="mt-3 inline-block rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                Bientôt
              </span>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
