import { headers } from 'next/headers'

export default function TestPage() {
  const headersList = headers()
  const slug = headersList.get('x-school-slug') ?? 'inconnu'
  const host = headersList.get('x-host') ?? 'inconnu'

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="mx-auto w-full max-w-2xl p-8">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="font-mono text-sm text-green-400">
            SYSTEME OPERATIONNEL
          </span>
        </div>

        <h1 className="mb-2 text-4xl font-bold">
          EduSmart <span className="text-yellow-400">Test</span>
        </h1>
        <p className="mb-10 text-gray-400">
          Page de verification du deploiement Vercel + wildcard DNS
        </p>

        <div className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-6 font-mono text-sm">
          <div className="mb-4 text-xs uppercase tracking-wider text-gray-500">
            Informations detectees
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 py-2">
            <span className="text-gray-400">Host</span>
            <span className="text-white">{host}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 py-2">
            <span className="text-gray-400">Slug ecole</span>
            <span className="font-bold text-yellow-400">{slug}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 py-2">
            <span className="text-gray-400">Middleware</span>
            <span className="text-green-400">actif</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-800 py-2">
            <span className="text-gray-400">Next.js</span>
            <span className="text-white">14 App Router</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400">Deployer sur</span>
            <span className="text-white">Vercel</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {[
            { label: 'Monorepo Turborepo', ok: true },
            { label: 'Wildcard *.edusmart.site', ok: true },
            { label: 'Middleware sous-domaine', ok: true },
            { label: 'Supabase (Phase 2)', ok: false },
            { label: 'OpenRouter IA (Phase 4)', ok: false },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className={ok ? 'text-green-400' : 'text-gray-600'}>
                {ok ? 'OK' : '--'}
              </span>
              <span className={ok ? 'text-gray-200' : 'text-gray-600'}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 font-mono text-xs text-gray-600">
          EduSmart - test.edusmart.site - Randrianarison Dieu Donne
        </div>
      </div>
    </main>
  )
}
