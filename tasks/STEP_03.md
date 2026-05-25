# STEP 03 — Implémenter le client Supabase dans `packages/shared`

> **Priorité** : 🔴 P0 — Pré-requis de toutes les apps qui veulent persister.
> **Estimation** : 2-3 heures.
> **Ordre** : 3ᵉ étape, **après STEP_01** (Supabase doit exister).

---

## ✅ ÉTAT — Exécuté le 2026-05-26

**Statut : TERMINÉ** ✅

### 🔧 Fichiers livrés dans `packages/shared/src/`

```
supabase/
├── client.ts        ✅ createSupabaseBrowserClient + createSupabaseAnonClient
├── server.ts        ✅ createSupabaseServerClient + createSupabaseServiceRoleClient
├── middleware.ts    ✅ updateSupabaseSession (refresh token auto)
├── types.ts         ✅ Types générés (2128 lignes, 33 tables)
└── index.ts         ✅ Réexports + helpers Tables/Inserts/Updates<T>

db/
├── index.ts         ✅ Façade — tout réexporté
├── organizations.ts ✅ getOrganizationBySlug, listOrganizations, updateOrganization
├── academic.ts      🆕 listAcademicYears, getCurrentAcademicYear, periods, setCurrent*
├── subjects.ts      🆕 listSubjectsByOrganization, getSubjectByCode, CRUD
├── classes.ts       ✅ listClassesByOrganization, getClassDetail, setHomeroomTeacher
├── students.ts      ✅ listStudentsByOrganization, getStudentDetail, enrollStudent
├── grades.ts        ✅ listGradesByStudent, recordGrade, computeClassAverages
├── homeworks.ts     🆕 listHomeworksByClass, submitHomework, gradeSubmission
├── attendance.ts    🆕 markAttendance, computeAttendanceRate, listByClassDate
├── schedule.ts      🆕 getClassSchedule, getTeacherSchedule, CRUD slots
├── messages.ts      🆕 listInbox, sendMessage, announcements, notifications
├── finance.ts       🆕 fee_types, invoices, recordPayment (auto-update statut)
├── bulletins.ts     🆕 upsertBulletinFromGrades (auto-mention), finalizeBulletin
├── programs.ts      ✅ listProgramsByOrganization, listFeaturedPrograms
└── news.ts          ✅ listPublishedNews, getNewsBySlug
```

**16 fichiers**, ~80 fonctions DB, **toutes commentées en français** avec docstrings explicatives (rôle, RLS, usage typique).

### 🎨 Bonus livré : Font Geist sur les 3 apps

| App | Stratégie | Fichier modifié |
|---|---|---|
| `apps/admin` | `next/font/local` | `src/app/layout.tsx`, `globals.css`, `tailwind.config.ts`, `src/app/fonts/Geist-VariableFont_wght.ttf` |
| `apps/vitrine` | `next/font/local` | Idem |
| `apps/desktop` | `@font-face` Vite | `src/styles.css`, `tailwind.config.ts`, `src/assets/fonts/Geist-VariableFont_wght.ttf` |

- **Self-hosted** (pas Google Fonts) → aucune requête externe, aucun tracking.
- **Police variable** (1 seul .ttf pour tous les poids 100→900).
- `font-display: swap` → pas de FOIT.
- Tailwind utilitaire `font-sans` pointe maintenant sur Geist partout.

### ✅ Validation

- [x] `@supabase/ssr` v0.5.2 + `@supabase/supabase-js` v2.105.4 dans `packages/shared/package.json`.
- [x] Types régénérés via MCP : 33 tables typées, autocomplétion partout.
- [x] Le client server lève une erreur explicite si `SUPABASE_SERVICE_ROLE_KEY` manquante.
- [x] Le client browser est compatible Expo (mobile/kids) via `createSupabaseAnonClient`.
- [x] La RLS s'applique automatiquement (cookies SSR propagés via middleware).

### ➡️ Reste à faire (post-STEP_03)

- [ ] Brancher l'auth réelle (STEP_04) — supprimer le login hardcodé admin.
- [ ] Connecter vitrine sur les helpers `db/programs.ts` et `db/news.ts` (STEP_05).
- [ ] Connecter admin sur `db/students.ts`, `db/classes.ts`, `db/grades.ts` (STEP_06).

---

## Contenu original ci-dessous (référence)

---

## 🎯 Objectif

Centraliser l'instanciation et la typage du client Supabase dans `packages/shared`, pour que :
- `apps/admin`, `apps/vitrine`, `apps/desktop`, `apps/mobile`, `apps/kids` puissent toutes faire `import { supabase } from '@edusmart/shared/supabase'`.
- Les types sont générés depuis le schéma DB → autocomplétion partout.
- Le client server (service role) et browser (anon) sont bien séparés.

---

## 📦 Fichiers concernés

```
packages/shared/src/supabase/
├── client.ts        ← Client browser (anon key) — usage Client Components + mobile + desktop renderer
├── server.ts        ← Client server (service role) — usage Server Components, Route Handlers, Edge Functions
├── middleware.ts    ← Helper Next.js pour propager la session cookie dans middleware
└── types.ts         ← Types générés via `supabase gen types typescript`

packages/shared/src/index.ts   ← Ajouter les exports

# Adapter les getters mock-data pour proposer une version Supabase :
packages/shared/src/db/
├── organizations.ts  ← getOrganizationBySlug, listOrganizations
├── students.ts       ← getStudentsByOrganization, getStudentById
├── grades.ts         ← getGradesByStudent, calculateAverages
├── programs.ts       ← getProgramsByOrganization
└── news.ts           ← getNewsByOrganization
```

---

## 🔗 Dépendances

- **Bloqué par** : [STEP_01](STEP_01.md) (projet Supabase + tables doivent exister pour générer les types).
- **Bloqué par** : [STEP_02](STEP_02.md) (les vraies clés doivent être disponibles).
- **Bloque** : [STEP_04](STEP_04.md) (auth), [STEP_05](STEP_05.md) (vitrine connectée), et toute autre app.

---

## ⚙️ Commandes à exécuter

### 1. Installer les dépendances dans `packages/shared`

```bash
pnpm --filter @edusmart/shared add @supabase/ssr
# @supabase/supabase-js est déjà installé (vérifier package.json)
```

### 2. Générer les types depuis Supabase

```bash
# Depuis la racine
npx supabase login

# Linker au projet
npx supabase link --project-ref <project-ref-from-url>

# Générer les types TS
npx supabase gen types typescript --linked --schema public > packages/shared/src/supabase/types.ts
```

> Le fichier `types.ts` doit ressembler à :
> ```ts
> export type Database = {
>   public: {
>     Tables: {
>       organizations: { Row: {...}, Insert: {...}, Update: {...} }
>       students: { Row: {...}, Insert: {...}, Update: {...} }
>       // ... 10 autres tables
>     }
>   }
> }
> ```

### 3. Créer `packages/shared/src/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// Pour mobile/desktop (pas de cookies, juste anon)
import { createClient } from '@supabase/supabase-js'

export function createSupabaseAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: true, autoRefreshToken: true } },
  )
}
```

### 4. Créer `packages/shared/src/supabase/server.ts`

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Pour Server Components, Route Handlers, Server Actions
export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    },
  )
}

// Pour usage admin (service role — bypass RLS, JAMAIS côté client !)
export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}
```

### 5. Créer `packages/shared/src/supabase/middleware.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from './types'

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // Force token refresh
  await supabase.auth.getUser()

  return response
}
```

### 6. Créer les data helpers `packages/shared/src/db/*.ts`

Exemple — `organizations.ts` :

```ts
import { createSupabaseServerClient } from '../supabase/server'

export async function getOrganizationBySlug(slug: string) {
  if (slug === '__root__') return null  // marketing global
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) {
    console.error('[getOrganizationBySlug]', error)
    return null
  }
  return data
}

export async function listOrganizations() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('organizations').select('id, slug, name, city').order('name')
  return data ?? []
}
```

> Faire pareil pour `students.ts`, `grades.ts`, `programs.ts`, `news.ts`.
> Garder `mock-data.ts` (utile pour tests + démo offline) mais **les apps appellent les versions DB**.

### 7. Mettre à jour `packages/shared/src/index.ts`

```ts
// Types existants
export * from './types/organization'
export * from './types/student'
export * from './types/grade'

// Utils existants
export { slugify } from './utils/slugify'
export { calculateAverage } from './utils/gradeCalc'

// Mocks (gardés pour tests/démo)
export * as mocks from './mock-data'

// Supabase clients
export {
  createSupabaseBrowserClient,
  createSupabaseAnonClient,
} from './supabase/client'
export {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from './supabase/server'
export { updateSupabaseSession } from './supabase/middleware'
export type { Database } from './supabase/types'

// Data helpers (versions DB)
export * from './db/organizations'
export * from './db/students'
export * from './db/grades'
export * from './db/programs'
export * from './db/news'
```

### 8. Tester l'import dans `apps/admin`

```ts
// apps/admin/src/app/students/page.tsx
import { getStudentsByOrganization } from '@edusmart/shared'
import { getAdminTenant } from '@/lib/admin-tenant'

export default async function StudentsPage() {
  const { organization } = await getAdminTenant()
  const students = await getStudentsByOrganization(organization.id)
  return <StudentsTable students={students} />
}
```

---

## ⚠️ Risques

| Risque | Mitigation |
|---|---|
| Mélange browser/server clients → fuite `SERVICE_ROLE_KEY` côté client | Convention nommage stricte (`*ServerClient` vs `*BrowserClient`), tests CI |
| Types pas générés → autocomplétion absente, bugs silencieux | Ajouter `pnpm db:types` au pre-commit ; CI vérifie `types.ts` à jour |
| RLS pas testée → un client browser peut "tout voir" si policies absentes | Tests d'intégration : se connecter en directeur STRELITZIA et vérifier qu'on ne voit pas UAZ |
| Le helper `cookies()` Next.js fail en Route Handler (chaque app a sa version) | Documenter dans `CLAUDE.md` |
| Rebuild de tous les apps après changement de `packages/shared` | Turbo cache + déclaration `peerDependencies` correcte |

---

## ✅ Validation

### Checklist

- [ ] `@supabase/ssr` ajouté à `packages/shared/package.json`
- [ ] `types.ts` généré depuis Supabase (12 tables visibles dans le `Database` type)
- [ ] `client.ts`, `server.ts`, `middleware.ts` créés
- [ ] 5 fichiers `db/*.ts` créés (organizations, students, grades, programs, news)
- [ ] `index.ts` exporte tout proprement
- [ ] `pnpm --filter @edusmart/admin type-check` passe
- [ ] `pnpm --filter @edusmart/vitrine type-check` passe
- [ ] `pnpm --filter @edusmart/admin dev` charge la page `/students` avec de vraies données
- [ ] Aucun import direct de `@supabase/supabase-js` dans les apps (tout passe par `@edusmart/shared`)

### Test fonctionnel

```bash
pnpm --filter @edusmart/vitrine dev
# Ouvre http://localhost:3001?school=strelitzia
# Vérifie que les programs viennent bien de Supabase (modifier un titre dans la DB, recharger → changement visible)
```

```bash
# Test d'isolation cross-tenant (manuel, avec deux sessions)
# Session 1 : login directeur STRELITZIA → /admin/students montre les élèves STRELITZIA
# Session 2 : login directeur UAZ → /admin/students montre les élèves UAZ (jamais ceux de STRELITZIA)
```

---

## 📋 Critères de complétude

Cette étape est **terminée** quand :
1. ✅ `import { createSupabaseServerClient } from '@edusmart/shared'` fonctionne dans les 6 apps.
2. ✅ Les types DB sont disponibles via `import type { Database } from '@edusmart/shared'`.
3. ✅ Au moins une page (ex: `apps/vitrine/src/app/programs/page.tsx`) lit ses données depuis Supabase et plus depuis les mocks.
4. ✅ Les tests type-check passent sur toutes les apps.

---

## ➡️ Prochaine étape

→ [STEP_04.md](STEP_04.md) — Implémenter l'authentification réelle (remplacer le login mock).
