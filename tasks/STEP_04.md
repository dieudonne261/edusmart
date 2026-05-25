# STEP 04 — Authentification réelle (remplacer le login hardcodé)

> **Priorité** : 🟠 P1 — Bloque toute notion de sécurité réelle et de session par rôle.
> **Estimation** : 4-6 heures.
> **Ordre** : 4ᵉ étape, **après STEP_03** (client Supabase doit être en place).

---

## 🎯 Objectif

Remplacer le login mock (`directeur@strelitzia.test` / `Test1234!` codé en dur dans `apps/admin/src/app/login/page.tsx`) par une authentification réelle Supabase, avec :
- Login email/password ET Magic Link.
- Login Google OAuth (1 seul credential pour toutes les écoles, redirect via `edusmart.site/auth/callback?school=...`).
- Middleware d'auth qui protège `/admin/*` et redirige vers `/admin/login`.
- Redirection post-login basée sur le rôle (`director` → dashboard, `teacher` → grades, etc.).
- Vérification anti cross-tenant (`profile.organization_id === slug.organization_id`).

---

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `apps/admin/src/app/login/page.tsx` | Remplacer le mock par un formulaire Supabase |
| `apps/admin/src/app/login/actions.ts` _(nouveau)_ | Server Actions `signInWithPassword`, `signInWithOAuth`, `signOut` |
| `apps/admin/src/app/auth/callback/route.ts` _(nouveau)_ | Handler OAuth/Magic Link callback |
| `apps/admin/src/middleware.ts` | Ajouter la vérification d'auth + redirect |
| `apps/admin/src/lib/admin-tenant.ts` | Ajouter la vérification `profile.organization_id === tenant.id` |
| `apps/admin/src/app/(authed)/layout.tsx` _(nouveau)_ | Layout protégé qui charge le profile |
| `apps/admin/src/lib/auth-helpers.ts` _(nouveau)_ | `getCurrentProfile()`, `requireRole(roles[])` |
| `apps/vitrine/src/app/auth/callback/route.ts` _(nouveau)_ | Callback shared pour OAuth multi-tenant |

---

## 🔗 Dépendances

- **Bloqué par** : [STEP_01](STEP_01.md) (Supabase Auth configurée), [STEP_02](STEP_02.md) (secrets sécurisés), [STEP_03](STEP_03.md) (client Supabase).
- **Bloque** : toute utilisation réelle de l'admin, toute mise en production.

---

## ⚙️ Commandes à exécuter

### 1. Créer un user de test dans Supabase

```
Dashboard Supabase → Authentication → Users → Add user
Email     : directeur@strelitzia.test
Password  : choisir un mot de passe fort
Auto Confirm User : ON
```

Puis dans le SQL Editor, créer son profile :
```sql
insert into profiles (id, organization_id, role, full_name)
values (
  (select id from auth.users where email = 'directeur@strelitzia.test'),
  (select id from organizations where slug = 'strelitzia'),
  'director',
  'Directeur STRELITZIA'
);
```

### 2. Server Actions login — `apps/admin/src/app/login/actions.ts`

```ts
'use server'

import { createSupabaseServerClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/post-login')  // → choisit la route selon le rôle
}

export async function signInWithOAuth(provider: 'google', schoolSlug: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL}?school=${schoolSlug}`,
    },
  })
  if (error) return { error: error.message }
  redirect(data.url)
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### 3. Page login — `apps/admin/src/app/login/page.tsx`

```tsx
import { signInWithPassword, signInWithOAuth } from './actions'
import { getAdminTenant } from '@/lib/admin-tenant'

export default async function LoginPage() {
  const { organization } = await getAdminTenant()
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-serif text-primary">
          Connexion — {organization.name}
        </h1>

        <form action={signInWithPassword} className="mt-6 space-y-4">
          <input name="email"    type="email"    required placeholder="Email"        className="..." />
          <input name="password" type="password" required placeholder="Mot de passe" className="..." />
          <button className="w-full bg-primary text-white py-2 rounded">Se connecter</button>
        </form>

        <form action={() => signInWithOAuth('google', organization.slug)} className="mt-4">
          <button className="w-full border py-2 rounded">Continuer avec Google</button>
        </form>
      </div>
    </main>
  )
}
```

### 4. Callback OAuth — `apps/vitrine/src/app/auth/callback/route.ts`

> **Important** : le callback Google **part de `edusmart.site`** (1 seul credential), puis redirige vers le sous-domaine école.

```ts
import { createSupabaseServerClient } from '@edusmart/shared'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code        = searchParams.get('code')
  const schoolSlug  = searchParams.get('school') ?? '__root__'

  if (code) {
    const supabase = createSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect vers le sous-domaine école
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN!
  const target = schoolSlug === '__root__'
    ? `https://${root}/dashboard`
    : `https://${schoolSlug}.${root}/dashboard`

  return NextResponse.redirect(target)
}
```

### 5. Middleware auth — `apps/admin/src/middleware.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { updateSupabaseSession, createSupabaseServerClient } from '@edusmart/shared'

const PUBLIC_PATHS = ['/login', '/auth/callback']

export async function middleware(req: NextRequest) {
  // 1. Résolution slug (existant)
  // ... (code multi-tenancy déjà en place)

  // 2. Refresh session Supabase
  const response = await updateSupabaseSession(req)

  // 3. Si route publique, on s'arrête
  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return response

  // 4. Sinon, exiger une session
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 6. Helpers — `apps/admin/src/lib/auth-helpers.ts`

```ts
import { createSupabaseServerClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, organization_id, full_name')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/login')
  return profile
}

export async function requireRole(allowed: string[]) {
  const profile = await getCurrentProfile()
  if (!allowed.includes(profile.role)) redirect('/forbidden')
  return profile
}

const REDIRECT_BY_ROLE: Record<string, string> = {
  super_admin: '/super',
  director:    '/',
  teacher:     '/grades',
  secretary:   '/students',
  parent:      '/dashboard',
  student:     '/dashboard/student',
}
export function redirectByRole(role: string) {
  return REDIRECT_BY_ROLE[role] ?? '/'
}
```

### 7. Vérification anti cross-tenant dans `getAdminTenant()`

```ts
// apps/admin/src/lib/admin-tenant.ts
import { headers } from 'next/headers'
import { getOrganizationBySlug } from '@edusmart/shared'
import { getCurrentProfile } from './auth-helpers'
import { redirect } from 'next/navigation'

export async function getAdminTenant() {
  const slug = headers().get('x-school-slug') ?? 'strelitzia'
  const organization = await getOrganizationBySlug(slug)
  if (!organization) redirect('/404')

  const profile = await getCurrentProfile()
  // 🛡️ Anti cross-tenant
  if (profile.role !== 'super_admin' && profile.organization_id !== organization.id) {
    redirect('/forbidden')
  }

  return { organization, profile }
}
```

### 8. Page post-login pour rediriger selon rôle — `apps/admin/src/app/post-login/page.tsx`

```tsx
import { getCurrentProfile, redirectByRole } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function PostLoginPage() {
  const profile = await getCurrentProfile()
  redirect(redirectByRole(profile.role))
}
```

---

## ⚠️ Risques

| Risque | Mitigation |
|---|---|
| User connecté à STRELITZIA accède à `uaz.edusmart.site/admin` | Vérif `profile.organization_id === organization.id` dans `getAdminTenant` |
| Boucle infinie de redirect login → middleware | Whitelister `/login` et `/auth/callback` dans `PUBLIC_PATHS` |
| Session perdue après refresh → user voit `/login` malgré déjà connecté | Appeler `updateSupabaseSession` dans le middleware pour rafraîchir le cookie |
| Google OAuth en mode Testing → bloqué pour les users non-listés | Acceptable phase mémoire ; passer en Prod avant déploiement réel |
| Token JWT custom claim `organization_id` manquant | Ajouter une Supabase Edge Function `on_auth_user_created` qui insère le profile automatiquement |
| Server Action `signInWithOAuth` ne peut pas appeler `redirect()` correctement | Tester ; Next 14 supporte `redirect()` dans les Server Actions |

---

## ✅ Validation

### Checklist

- [ ] User de test créé dans Supabase Auth + profile inséré
- [ ] `actions.ts` créé (signInWithPassword, signInWithOAuth, signOut)
- [ ] `login/page.tsx` refait sans aucun secret hardcodé
- [ ] `auth/callback/route.ts` créé dans `apps/vitrine` (point d'entrée OAuth unique)
- [ ] `middleware.ts` admin protège les routes non publiques
- [ ] `auth-helpers.ts` créé (`getCurrentProfile`, `requireRole`, `redirectByRole`)
- [ ] `admin-tenant.ts` vérifie l'isolation tenant
- [ ] Le login fonctionne en password ET en Magic Link ET en Google
- [ ] Logout fonctionne et invalide la session
- [ ] Tester cross-tenant : login STRELITZIA → tentative `uaz.edusmart.site/admin` → 403

### Test fonctionnel manuel

```
1. http://localhost:3002?school=strelitzia
   → redirige vers /login (car pas de session)
2. Login avec directeur@strelitzia.test / <password>
   → redirige vers /post-login → /
   → dashboard avec données STRELITZIA
3. Bouton "Se déconnecter"
   → retour /login
4. Login Google avec un test_user autorisé
   → redirect via /auth/callback?school=strelitzia
   → arrive sur /dashboard
5. Avec session active STRELITZIA, tenter http://localhost:3002?school=uaz
   → redirect /forbidden (anti cross-tenant)
```

---

## 📋 Critères de complétude

Cette étape est **terminée** quand :
1. ✅ Plus aucune trace de `directeur@strelitzia.test` / `Test1234!` dans le code.
2. ✅ Toutes les routes `/admin/*` exigent une session Supabase valide.
3. ✅ La redirection post-login dépend du `role` du profile.
4. ✅ L'isolation cross-tenant est testée et fonctionne.
5. ✅ Google OAuth fonctionne via le callback unique `edusmart.site/auth/callback`.

---

## ➡️ Prochaine étape

→ [STEP_05.md](STEP_05.md) — Brancher la vitrine sur Supabase (programs, news, organizations).
