import Link from 'next/link'

export default function InscriptionMerciPage({
  searchParams,
}: {
  searchParams?: { school?: string }
}) {
  const school = searchParams?.school

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf7] px-5">
      <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#1A4D3A] text-sm font-bold text-white">
          ES
        </span>
        <p className="mt-6 text-sm font-semibold uppercase text-[#1A4D3A]">
          Demande recue
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Votre ecole est dans la file de deploiement.
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Nous verifierons le sous-domaine{school ? ` ${school}.edusmart.site` : ''}
          , puis nous reviendrons vers vous pour activer l'espace admin.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-[#1A4D3A] px-4 text-sm font-semibold text-white"
        >
          Retour a l'accueil
        </Link>
      </section>
    </main>
  )
}
