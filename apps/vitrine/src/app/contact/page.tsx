import Link from 'next/link'
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
  const errorLabel =
    error === 'missing'
      ? 'Nom, email et message sont requis.'
      : error === 'storage'
        ? 'Le message n\'a pas pu etre enregistre. Reessayez dans un instant.'
        : error

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-green-deep">Contact EduSmart</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Inscrire mon ecole sur EduSmart
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Pour demarrer une ecole sur la plateforme, remplis le formulaire
            d'inscription. La demande sera stockee dans Supabase et traitee
            depuis l'administration.
          </p>
          <Link
            href="/inscription"
            className="mt-5 inline-flex rounded-md bg-green-deep px-4 py-2 text-sm font-semibold text-white"
          >
            Remplir le formulaire
          </Link>
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
            Ecrire a {tenant.school.name}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Inscriptions, visites, demandes d'information. Nous repondons sous 48h.
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            {(
              [
                ['Email', tenant.school.email ?? 'contact@edusmart.site'],
                ['Telephone', tenant.school.phone],
                ['Adresse', tenant.school.address],
                ['Ville', tenant.school.city],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-slate-950">{value ?? '-'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          {sent && (
            <div className="mb-5 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
              Message envoye. Nous reviendrons vers vous tres vite.
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorLabel}
            </div>
          )}

          <form
            action={`/api/contact?school=${tenant.school.slug}`}
            method="POST"
            className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Field label="Nom complet" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Telephone" name="phone" />
            <Field label="Sujet" name="subject" />
            <label className="block text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                required
                rows={5}
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[var(--school-primary)] focus:ring-2 focus:ring-slate-200"
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

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 block h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-[var(--school-primary)] focus:ring-2 focus:ring-slate-200"
      />
    </label>
  )
}
