# STEP 05 — Connecter la vitrine à Supabase (programs, news, organizations)

> **Priorité** : 🟠 P1 — Démo crédible + ajout dynamique d'une école sans rebuild.
> **Estimation** : 3-5 heures.
> **Ordre** : 5ᵉ étape, **après STEP_03** (client) et idéalement après [STEP_04](STEP_04.md) (pour les pages familles authentifiées).

---

## 🎯 Objectif

Remplacer toutes les sources mockées de la vitrine par des fetches Supabase, tout en :
- gardant le **dual-mode** (root marketing vs école) déjà en place,
- ajoutant l'**ISR** pour les pages publiques (revalidation 60 s),
- préservant le **theming dynamique** par école (couleurs/logo),
- ajoutant un **formulaire d'inscription d'école** qui POSTe dans `school_requests`.

---

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `apps/vitrine/src/lib/tenant.ts` | Remplacer `getOrganizationBySlug` mock par version Supabase |
| `apps/vitrine/src/app/page.tsx` | Switch entre marketing global et page école selon `__root__` |
| `apps/vitrine/src/app/about/page.tsx` | Lire `vitrine_settings` + `team_members` |
| `apps/vitrine/src/app/programs/page.tsx` | Lister depuis `programs` filtrés par `organization_id` |
| `apps/vitrine/src/app/news/page.tsx` | Lister depuis `news_articles` (published=true) |
| `apps/vitrine/src/app/news/[slug]/page.tsx` _(nouveau)_ | Article détail |
| `apps/vitrine/src/app/contact/page.tsx` | Formulaire → POST `/api/contact` |
| `apps/vitrine/src/app/api/contact/route.ts` | Envoyer email via Resend + insérer dans une table `contact_messages` |
| `apps/vitrine/src/app/(root)/inscription/page.tsx` _(nouveau)_ | Formulaire B2B "Inscrire mon école" → POST `school_requests` |
| `apps/vitrine/src/components/school-shell.tsx` | Lire `colors` depuis l'organization et injecter en CSS vars |

---

## 🔗 Dépendances

- **Bloqué par** : [STEP_01](STEP_01.md), [STEP_03](STEP_03.md).
- **Optionnel mais utile** : [STEP_04](STEP_04.md) (pour les zones "espace parent" connecté de la vitrine).
- **Bloque** : démo `strelitzia.edusmart.site` avec vraies données.

---

## ⚙️ Commandes à exécuter

### 1. Refactorer `tenant.ts`

```ts
// apps/vitrine/src/lib/tenant.ts
import { headers } from 'next/headers'
import { getOrganizationBySlug } from '@edusmart/shared'

export type TenantContext = {
  slug: string
  organization: Awaited<ReturnType<typeof getOrganizationBySlug>> | null
  isRoot: boolean
  host: string
}

export async function getTenantContext(): Promise<TenantContext> {
  const h = headers()
  const slug = h.get('x-school-slug') ?? '__root__'
  const host = h.get('x-host') ?? ''
  const isRoot = slug === '__root__'
  const organization = isRoot ? null : await getOrganizationBySlug(slug)
  return { slug, organization, isRoot, host }
}

export function schoolHref(path: string, slug?: string) {
  if (!slug || slug === '__root__') return path
  if (typeof window === 'undefined') return path  // SSR : path simple
  return path  // ou construire l'URL absolue si besoin
}
```

### 2. Page d'accueil — dual-mode

```tsx
// apps/vitrine/src/app/page.tsx
import { getTenantContext } from '@/lib/tenant'
import { RootMarketing } from '@/components/root-marketing'
import { SchoolHomepage } from '@/components/school-homepage'

export const revalidate = 60  // ISR

export default async function HomePage() {
  const { isRoot, organization } = await getTenantContext()
  if (isRoot) return <RootMarketing />
  if (!organization) return <NotFoundSchool />
  return <SchoolHomepage organization={organization} />
}
```

### 3. Page programs

```tsx
// apps/vitrine/src/app/programs/page.tsx
import { getTenantContext } from '@/lib/tenant'
import { getProgramsByOrganization } from '@edusmart/shared'

export const revalidate = 60

export default async function ProgramsPage() {
  const { organization, isRoot } = await getTenantContext()
  if (isRoot) return <RootProgramsOverview />  // marketing : "découvrez les écoles..."
  if (!organization) return null

  const programs = await getProgramsByOrganization(organization.id)
  return (
    <section className="container mx-auto py-12">
      <h1 className="text-3xl font-serif text-primary">Nos programmes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {programs.map(p => (
          <article key={p.id} className="p-6 rounded-2xl bg-surface">
            <h2 className="text-xl">{p.title}</h2>
            <p className="text-sm text-muted">{p.level} · {p.duration}</p>
            <p className="mt-2">{p.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
```

### 4. Page news avec détail

```tsx
// apps/vitrine/src/app/news/page.tsx
import { getNewsByOrganization } from '@edusmart/shared'
import { getTenantContext } from '@/lib/tenant'
import Link from 'next/link'

export const revalidate = 60

export default async function NewsPage() {
  const { organization } = await getTenantContext()
  if (!organization) return null
  const news = await getNewsByOrganization(organization.id)
  return (
    <section className="container mx-auto py-12">
      <h1 className="text-3xl font-serif text-primary">Actualités</h1>
      <ul className="mt-8 space-y-6">
        {news.map(n => (
          <li key={n.id}>
            <Link href={`/news/${n.id}`}>
              <h2 className="text-xl">{n.title}</h2>
              <p className="text-muted">{n.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

### 5. Page contact + envoi Resend

```ts
// apps/vitrine/src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceRoleClient } from '@edusmart/shared'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const name    = String(form.get('name'))
  const email   = String(form.get('email'))
  const message = String(form.get('message'))
  const slug    = req.headers.get('x-school-slug') ?? '__root__'

  if (!name || !email || !message) {
    return NextResponse.redirect(new URL('/contact?error=missing', req.url), 303)
  }

  // 1. Stocker en DB (service role car pas d'auth)
  const supabase = createSupabaseServiceRoleClient()
  await supabase.from('contact_messages').insert({ name, email, message, school_slug: slug })

  // 2. Envoyer email via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'EduSmart <noreply@edusmart.site>',
      to:   ['contact@edusmart.site'],  // ou email du directeur de l'école
      subject: `Contact ${slug} — ${name}`,
      reply_to: email,
      text: message,
    }),
  })

  return NextResponse.redirect(new URL('/contact?sent=1', req.url), 303)
}
```

> 📌 Ajouter la table `contact_messages` au schéma SQL (étape STEP_01) :
> ```sql
> create table contact_messages (
>   id uuid primary key default uuid_generate_v4(),
>   school_slug text,
>   name text not null,
>   email text not null,
>   message text not null,
>   created_at timestamptz default now()
> );
> alter table contact_messages enable row level security;
> create policy "public_insert_contact" on contact_messages for insert with check (true);
> ```

### 6. Formulaire d'inscription d'école (B2B, sur edusmart.site)

```tsx
// apps/vitrine/src/app/(root)/inscription/page.tsx
import { submitSchoolRequest } from './actions'

export default function Page() {
  return (
    <form action={submitSchoolRequest} className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-serif">Inscrire mon école</h1>
      <input name="school_name"   required placeholder="Nom de l'école" />
      <input name="slug_wanted"   required placeholder="Sous-domaine souhaité (ex: strelitzia)" />
      <input name="director_email" type="email" required placeholder="Email du directeur" />
      <input name="city"          required placeholder="Ville" />
      <button>Envoyer la demande</button>
    </form>
  )
}
```

```ts
// apps/vitrine/src/app/(root)/inscription/actions.ts
'use server'
import { createSupabaseServiceRoleClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

export async function submitSchoolRequest(formData: FormData) {
  const supabase = createSupabaseServiceRoleClient()
  await supabase.from('school_requests').insert({
    school_name:    String(formData.get('school_name')),
    slug_wanted:    String(formData.get('slug_wanted')),
    director_email: String(formData.get('director_email')),
    city:           String(formData.get('city')),
  })
  redirect('/inscription/merci')
}
```

### 7. Theming dynamique CSS vars

```tsx
// apps/vitrine/src/components/school-shell.tsx
import { getTenantContext } from '@/lib/tenant'

export async function SchoolShell({ children }: { children: React.ReactNode }) {
  const { organization } = await getTenantContext()
  const colors = organization?.colors ?? { primary:'#1A4D3A', secondary:'#C9A84C', surface:'#FAFAF8' }
  return (
    <div style={{
      '--color-primary':   colors.primary,
      '--color-secondary': colors.secondary,
      '--color-surface':   colors.surface,
    } as React.CSSProperties}>
      {/* header + nav + footer */}
      {children}
    </div>
  )
}
```

---

## ⚠️ Risques

| Risque | Mitigation |
|---|---|
| Page école avec slug invalide → écran blanc | `if (!organization) return <NotFoundSchool />` + 404 explicite |
| ISR cache une école qui change ses couleurs → ancien thème persiste 60 s | Acceptable ; sinon `revalidatePath('/')` dans une route admin |
| Service role client utilisé côté browser par erreur | Ne JAMAIS l'importer dans un composant client (`'use client'`) ; lint custom |
| Formulaire d'inscription école spammé | Rate-limit (Upstash Redis) + captcha (hCaptcha) |
| Email Resend ne part pas → user ne sait pas | Logger les erreurs + page `?sent=1` peut quand même s'afficher |
| Theming CSS vars cassé en SSR (pas de hydration) | Inliner les vars dans `<html style={...}>` du layout |

---

## ✅ Validation

### Checklist

- [ ] `tenant.ts` utilise `getOrganizationBySlug` de `@edusmart/shared` (Supabase)
- [ ] Page d'accueil dual-mode fonctionne (`localhost:3001` vs `localhost:3001?school=strelitzia`)
- [ ] `/programs` liste les programs depuis Supabase
- [ ] `/news` liste les news (published=true uniquement)
- [ ] `/contact` POST → email Resend reçu + ligne en DB `contact_messages`
- [ ] `/inscription` POST → ligne en DB `school_requests`
- [ ] Theming dynamique : changer `colors.primary` dans la DB → page recharge avec nouvelle couleur (après revalidation)
- [ ] ISR : modifier un program → visible après 60 s sans rebuild
- [ ] 404 propre pour slug inexistant

### Tests fonctionnels

```bash
# 1. Marketing global
http://localhost:3001
# → page B2B "Inscrire votre école", liste des écoles partenaires

# 2. Vitrine STRELITZIA
http://localhost:3001?school=strelitzia
# → thème vert/or, programs/news STRELITZIA

# 3. Vitrine UAZ
http://localhost:3001?school=uaz
# → thème violet/jaune, programs/news UAZ

# 4. Slug invalide
http://localhost:3001?school=nonexistent
# → 404 "École introuvable"

# 5. Inscription école
http://localhost:3001/inscription
# Remplir → vérifier ligne dans school_requests via SQL Editor

# 6. Contact
http://localhost:3001/contact (sur école)
# Remplir → vérifier email reçu + ligne contact_messages
```

---

## 📋 Critères de complétude

Cette étape est **terminée** quand :
1. ✅ Aucun import de `mock-data.ts` dans `apps/vitrine` (sauf tests).
2. ✅ Toutes les pages publiques affichent des données réelles Supabase.
3. ✅ Le theming change quand on modifie `colors` dans `organizations`.
4. ✅ Le formulaire d'inscription crée une `school_requests`.
5. ✅ Une nouvelle école ajoutée par INSERT en base devient instantanément accessible via `<slug>.edusmart.site` (après revalidation 60 s).

---

## ➡️ Prochaines étapes

→ **STEP_06** _(à générer Phase 2)_ — Brancher l'admin sur Supabase (students, grades).
→ **STEP_07** _(à générer Phase 2)_ — Implémenter `/api/ai/generate` réelle (OpenRouter).
→ **STEP_08** _(à générer Phase 2)_ — Démarrer `apps/mobile` (login + tabs + notes).

> Roadmap complète : [docs/10-roadmap/NEXT_ACTIONS.md](../docs/10-roadmap/NEXT_ACTIONS.md).
