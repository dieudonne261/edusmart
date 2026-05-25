import { getAdminTenant } from '@/lib/admin-tenant'

export default function LoginPage() {
  const tenant = getAdminTenant()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <form className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
            {tenant.school.logoInitials}
          </span>
          <div>
            <p className="font-bold text-slate-950">{tenant.school.name}</p>
            <p className="text-sm text-slate-500">Connexion admin</p>
          </div>
        </div>
        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            defaultValue="directeur@strelitzia.test"
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Mot de passe
          <input
            type="password"
            defaultValue="Test1234!"
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button className="mt-5 w-full rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          Se connecter
        </button>
      </form>
    </main>
  )
}
