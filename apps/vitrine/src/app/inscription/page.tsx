import Link from 'next/link'
import { SchoolRequestForm } from './school-request-form'

export const dynamic = 'force-dynamic'

const benefits = [
  'Vitrine publique multi-ecole avec sous-domaine',
  'Dashboard direction, eleves, classes et notes',
  'Base Supabase securisee par organisation',
  'Applications parent, enfant et desktop prevues',
]

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-[#f8faf7]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1A4D3A] text-sm font-bold text-white">
              ES
            </span>
            <span className="font-bold text-slate-950">EduSmart</span>
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Contact
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase text-[#1A4D3A]">
            Demande de deploiement
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
            Inscrire votre ecole sur EduSmart.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Envoyez les informations de base. Nous preparons le tenant, le
            sous-domaine, les roles admin et les premieres donnees de demo
            pretes pour validation.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold leading-6 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <SchoolRequestForm />
      </section>
    </main>
  )
}
