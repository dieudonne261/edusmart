import { AI_TOOLS } from '@edusmart/shared'
import { AdminShell } from '@/components/admin-shell'
import { getAdminTenant } from '@/lib/admin-tenant'

export default function AiToolsPage() {
  const tenant = getAdminTenant()

  return (
    <AdminShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="ai-tools"
    >
      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-slate-500">
            OpenRouter
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Outils IA admin
          </h2>
          <div className="mt-5 space-y-3">
            {AI_TOOLS.map((tool) => (
              <article
                key={tool.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">{tool.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {tool.description}
                    </p>
                  </div>
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                    CLE API
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form
          action="/api/ai/generate"
          method="post"
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <p className="text-sm font-semibold uppercase text-slate-500">
            Prompt rapide
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Generer un brouillon
          </h2>
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Type
            <select
              name="type"
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
              defaultValue="lesson"
            >
              <option value="lesson">Plan de cours</option>
              <option value="quiz">Quiz</option>
              <option value="appreciation">Appreciation</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Matiere
            <input
              name="subject"
              defaultValue="Mathematiques"
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Theme
            <textarea
              name="theme"
              rows={5}
              defaultValue="Fractions et resolution de problemes"
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <button className="mt-5 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Generer
          </button>
        </form>
      </section>
    </AdminShell>
  )
}
