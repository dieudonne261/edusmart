/**
 * /contact — Formulaire de contact (POST → /api/contact côté serveur).
 * Mode root : présentation simple (le formulaire d'inscription école viendra
 * sur /inscription dans STEP_05+).
 */
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export const revalidate = 60

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { sent?: string; error?: string }
}) {
  const tenant = await getTenantContext()
  const sent = searchParams?.sent === '1'
  const error = searchParams?.error

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">Contact EduSmart</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Inscrire mon école sur EduSmart
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Pour démarrer une école sur la plateforme, envoie-nous un email :
            <br />
            <a href="mailto:contact@edusmart.site" className="mt-2 inline-block font-bold text-green-deep">
              contact@edusmart.site
            </a>
          </p>
        </section>
      </main>
    )
  }

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="contact">
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_1fr]">
        <section>
          <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Écrire à {tenant.school.name}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Inscriptions, visites, demandes d&apos;information. Nous répondons
            sous 48h.
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            {(
              [
                ['Email', tenant.school.email ?? 'contact@edusmart.site'],
                ['Téléphone', tenant.school.phone],
                ['Adresse', tenant.school.address],
                ['Ville', tenant.school.city],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-slate-950">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          {sent && (
            <div className="mb-5 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
              ✅ Message envoyé. Nous reviendrons vers vous très vite.
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
              ❌ {decodeURIComponent(error)}
            </div>
          )}

          <form
            action={`/api/contact?school=${tenant.school.slug}`}
            method="POST"
            className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
          >
            <label className="block text-sm font-semibold text-slate-700">
              Nom complet
              <input
                name="name"
                required
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Sujet
              <input
                name="subject"
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                required
                rows={5}
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md px-5 py-3 text-sm font-semibold text-white"
              style={{ background: 'var(--school-primary)' }}
            >
              Envoyer
            </button>
          </form>
        </section>
      </main>
    </SchoolShell>
  )
}
