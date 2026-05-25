/**
 * Page 403 : affichée quand un user tente d'accéder à une école qui n'est pas
 * la sienne (ex : directeur UAZ qui tape strelitzia.edusmart.site/admin).
 */
import Link from 'next/link'
import { signOut } from '../login/actions'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-5xl">🛡️</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Accès refusé</h1>
        <p className="mt-3 text-sm text-slate-600">
          Tu n&apos;as pas les droits pour accéder à cette école.
          Reconnecte-toi avec un compte autorisé.
        </p>
        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Se déconnecter
          </button>
        </form>
        <Link href="https://edusmart.site" className="mt-3 block text-xs text-slate-400">
          Retour à edusmart.site
        </Link>
      </div>
    </main>
  )
}
