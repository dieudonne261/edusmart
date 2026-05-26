# PROMPT CLAUDE — ÉTAPE 05 : Connecter la vitrine à Supabase (programs, news, organizations)

> 🎯 **OBJECTIF** : Remplacer l'ensemble des données statiques/mockées de la vitrine (`apps/vitrine`) par des requêtes dynamiques Supabase via `@edusmart/shared`, tout en conservant le double affichage (marketing racine vs portail d'école) et en appliquant l'ISR (Incremental Static Regeneration).

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/vitrine` : Next.js 14 (site public)
- `apps/admin` : Next.js 14 (portail administration)
- `packages/shared` : Types, DB helpers, client Supabase partagé (`@edusmart/shared`)

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `apps/vitrine/src/lib/tenant.ts` | **Modifier** | Utiliser la version Supabase de `getOrganizationBySlug`. |
| `apps/vitrine/src/app/page.tsx` | **Modifier** | Gérer le double affichage racine marketing (`__root__`) / portail école. |
| `apps/vitrine/src/app/about/page.tsx` | **Modifier** | Charger les sections "À propos" et l'équipe (`team_members`) depuis Supabase. |
| `apps/vitrine/src/app/programs/page.tsx` | **Modifier** | Lister les programmes de formation rattachés à l'établissement. |
| `apps/vitrine/src/app/news/page.tsx` | **Modifier** | Lister les actualités publiées (`is_published = true`). |
| `apps/vitrine/src/app/news/[slug]/page.tsx` | **Créer** | Page de détail d'un article. |
| `apps/vitrine/src/app/contact/page.tsx` | **Modifier** | Formulaire envoyant les messages vers l'API. |
| `apps/vitrine/src/app/api/contact/route.ts` | **Créer** | Route API qui insère le message de contact dans `contact_messages` (via Service Role Client) et l'envoie par email via Resend. |
| `apps/vitrine/src/app/(root)/inscription/page.tsx` | **Créer** | Formulaire B2B "Inscrire mon école" insérant une demande dans `school_requests`. |
| `apps/vitrine/src/app/(root)/inscription/actions.ts` | **Créer** | Server Action d'insertion de la demande d'inscription d'école. |
| `apps/vitrine/src/components/school-shell.tsx` | **Modifier** | Injecter dynamiquement les variables de couleurs CSS de l'organisation (`colors.primary`, etc.). |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez appliquer les modifications suivantes dans `apps/vitrine` :

### 1. Adapter le Contexte de Résolution (`apps/vitrine/src/lib/tenant.ts`)
Récupérer le slug de l'école depuis les en-têtes injectés par le middleware Next.js (`x-school-slug`). Si le slug vaut `__root__`, c'est le portail marketing. Sinon, appeler le helper de données Supabase `getOrganizationBySlug(slug)`.
```typescript
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
```

### 2. Implémenter l'ISR (Incremental Static Regeneration)
Sur toutes les pages publiques (Accueil, About, Programs, News), ajouter l'instruction suivante pour mettre en cache les pages et revalider en arrière-plan toutes les 60 secondes :
```typescript
export const revalidate = 60
```

### 3. Route API de Contact avec Envoi Resend (`apps/vitrine/src/app/api/contact/route.ts`)
*   Cette route doit être accessible publiquement (sans session). Utilisez `createSupabaseServiceRoleClient()` pour contourner la RLS et enregistrer le message dans la table `contact_messages`.
*   Effectuer un appel HTTP POST vers `https://api.resend.com/emails` avec la clé `process.env.RESEND_API_KEY` pour notifier l'administrateur.
*   Rediriger l'utilisateur vers `/contact?sent=1`.

### 4. Formulaire de Demande d'Inscription d'École (`apps/vitrine/src/app/(root)/inscription/page.tsx`)
Créer un formulaire B2B propre à la racine marketing pour permettre aux directeurs d'inscrire leur école. La soumission doit appeler la Server Action `submitSchoolRequest()` qui réalise un INSERT dans `school_requests` via le client Supabase Service Role.

### 5. Intégrer le Theming CSS Dynamique (`apps/vitrine/src/components/school-shell.tsx`)
Lire le champ `colors` (JSONB) retourné par Supabase pour l'établissement (`{ primary: "#...", secondary: "#...", surface: "#..." }`) et injecter ces valeurs sous forme de variables CSS en ligne sur le conteneur global :
```tsx
import { getTenantContext } from '@/lib/tenant'

export async function SchoolShell({ children }: { children: React.ReactNode }) {
  const { organization } = await getTenantContext()
  const colors = organization?.colors ?? { primary: '#1A4D3A', secondary: '#C9A84C', surface: '#FAFAF8' }

  return (
    <div style={{
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-surface': colors.surface,
    } as React.CSSProperties}>
      {children}
    </div>
  )
}
```
Dans `index.css` de la vitrine, configurer Tailwind ou vos styles Vanilla pour exploiter ces variables CSS (ex: `bg-[var(--color-primary)]` ou `background-color: var(--color-primary)`).

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  **Portail Marketing** : En accédant à `localhost:3001` (ou en passant `x-school-slug = __root__`), le site affiche la vitrine de présentation d'EduSmart.
2.  **Portails Écoles** : En accédant à `localhost:3001?school=strelitzia` (ou via le header correspondant), le site charge le thème propre à Strelitzia (Vert/Or) avec ses programmes et ses actualités.
3.  **Portail UAZ** : En accédant à `localhost:3001?school=uaz`, le site charge le thème propre à UAZ (Violet/Jaune) et ses actualités.
4.  **404** : Un sous-domaine inexistant redirige vers un écran "École introuvable".
5.  Le formulaire d'inscription crée bien une ligne dans la table `school_requests` visible dans Supabase.
6.  Le formulaire de contact envoie l'email via Resend et persiste la demande dans `contact_messages`.
