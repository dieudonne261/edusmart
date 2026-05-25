import { getAdminTenantPublic } from '@/lib/admin-tenant'
import { LoginForm } from './login-form'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PAGE /admin/login
 * ─────────────────────────────────────────────────────────────────────────────
 *  Server Component : récupère l'école courante (depuis le slug du sous-domaine)
 *  pour afficher son nom + ses couleurs. Délègue le formulaire à `LoginForm`
 *  qui doit être Client Component (useFormState).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default async function LoginPage() {
  const { school, slug } = await getAdminTenantPublic()
  const schoolName = school?.name ?? 'EduSmart'
  const colors =
    (school?.colors as { primary?: string; secondary?: string } | null | undefined) ?? null

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-100 px-5"
      style={{
        // Theming dynamique selon l'école (cf. colors JSONB en DB)
        ['--school-primary' as string]: colors?.primary ?? '#1A4D3A',
        ['--school-secondary' as string]: colors?.secondary ?? '#C9A84C',
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-md text-sm font-bold text-white"
            style={{ background: 'var(--school-primary)' }}
          >
            {schoolName.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-slate-950">{schoolName}</p>
            <p className="text-sm text-slate-500">Connexion administration</p>
          </div>
        </header>

        <LoginForm schoolSlug={slug} />

        <p className="mt-6 text-xs text-slate-400">
          Besoin d&apos;aide&nbsp;? Contactez{' '}
          <a href="mailto:contact@edusmart.site" className="font-semibold text-slate-600">
            contact@edusmart.site
          </a>
        </p>
      </div>
    </main>
  )
}
