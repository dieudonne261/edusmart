import { SchoolShell } from '@/components/school-shell'
import { getTenantContext } from '@/lib/tenant'

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { sent?: string; school?: string }
}) {
  const tenant = getTenantContext()
  const sent = searchParams?.sent === '1'

  if (tenant.mode === 'root') {
    return (
      <main className="min-h-screen bg-cream px-5 py-12">
        <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-green-deep">
            Contact EduSmart
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Demander la creation d&apos;une ecole
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            La prochaine etape sera de brancher ce formulaire a la table
            school_requests dans Supabase.
          </p>
        </section>
      </main>
    )
  }

  return (
    <SchoolShell
      school={tenant.school}
      isLocal={tenant.isLocal}
      active="contact"
    >
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Contacter {tenant.school.name}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Envoyez une demande d&apos;information. Pour le moment, le formulaire
            confirme la reception localement; Supabase prendra le relais dans la
            phase suivante.
          </p>
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <p className="font-bold text-slate-950">{tenant.school.email}</p>
            <p className="mt-1 text-slate-600">{tenant.school.phone}</p>
            <p className="mt-1 text-slate-600">{tenant.school.address}</p>
          </div>
        </section>

        <form
          action={`/api/contact?school=${tenant.school.slug}`}
          method="post"
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          {sent ? (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">
              Demande recue. Elle sera stockee dans Supabase apres branchement.
            </div>
          ) : null}
          <label className="block text-sm font-semibold text-slate-700">
            Nom complet
            <input
              name="name"
              required
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Message
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <button className="mt-5 rounded-md bg-[var(--school-primary)] px-5 py-3 text-sm font-semibold text-white">
            Envoyer la demande
          </button>
        </form>
      </main>
    </SchoolShell>
  )
}
