# PROMPT CLAUDE — ÉTAPE 03 : Client Supabase dans `packages/shared` (RÉFÉRENCE)

> ℹ️ **STATUT : DÉJÀ EXÉCUTÉ**  
> Ce prompt sert de référence pour la structure du client Supabase centralisé et ses helpers de base de données.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/vitrine` : Next.js 14 (site public)
- `apps/admin` : Next.js 14 (portail administration)
- `apps/desktop` : Electron 30 + Vite + React (secrétariat offline)
- `apps/mobile` : Expo 51 (suivi parents/élèves)
- `apps/kids` : Expo 51 (app enfant gamifiée)
- `apps/test` : Next.js 14 (sandbox de déploiement)
- `packages/shared` : Types, DB helpers, client Supabase partagé
- `packages/ui` : Design tokens partagés

---

## 🎯 OBJECTIF DE L'ÉTAPE 03
Centraliser la configuration et l'instanciation du client Supabase (SSR server client, browser client, service role client, et client mobile/desktop) dans le package `@edusmart/shared` pour éviter la duplication et standardiser l'isolation multi-tenant. Générer les types TypeScript à partir du schéma de la base de données et créer les premiers data helpers typés.

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

### 1. Dépendances de packages/shared
Ajouter les dépendances nécessaires dans `packages/shared/package.json` :
*   `@supabase/ssr` (gestion cookies session Next.js)
*   `@supabase/supabase-js`

### 2. Génération des types
Générer le fichier de type TypeScript depuis Supabase CLI :
```bash
npx supabase gen types typescript --linked --schema public > packages/shared/src/supabase/types.ts
```

### 3. Clients Supabase (`packages/shared/src/supabase/`)
Créer les clients adaptés aux différents environnements d'exécution :
*   `client.ts` : Client browser (anon key) pour les Client Components Next.js et clients Expo/Electron.
*   `server.ts` : Client server pour les Server Components et Route Handlers Next.js, et client Service Role bypassant la RLS (serveur uniquement).
*   `middleware.ts` : Helper Next.js pour mettre à jour la session dans le cookie d'authentification.

### 4. Data Helpers (`packages/shared/src/db/`)
Développer les premiers fichiers de requêtes typées vers PostgreSQL pour découpler l'accès aux données :
*   `organizations.ts` : `getOrganizationBySlug(slug)`, `listOrganizations()`
*   `students.ts` : `listStudentsByOrganization(orgId)`, `getStudentDetail(studentId)`
*   `grades.ts` : `listGradesByStudent(studentId)`
*   `programs.ts` : `listProgramsByOrganization(orgId)`
*   `news.ts` : `listPublishedNews(orgId)`

### 5. Exports
Mettre à jour le barrel file `packages/shared/src/index.ts` pour exporter proprement les clients et les helpers de base de données.

---

## ✅ CRITÈRES DE VALIDATION
1.  `pnpm --filter @edusmart/shared type-check` passe sans erreur TypeScript.
2.  Les types autogénérés couvrent les 33 tables de la base de données.
3.  Aucune application n'importe directement `@supabase/supabase-js` (toutes passent par `@edusmart/shared`).
