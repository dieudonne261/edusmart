# PROMPT CLAUDE — ÉTAPE 14 : CI étendue + Sentry + rate-limit + Edge Functions

> 🎯 **OBJECTIF** : Industrialiser la plateforme en déployant une intégration continue (CI) complète sur GitHub, en intégrant le suivi d'erreurs **Sentry** (Next.js et React Native), en protégeant les APIs d'IA par du **rate-limiting** avec Upstash Redis, et en programmant des **Edge Functions** (Supabase/Deno) événementielles.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/admin` : Next.js 14 (portail administration)
- `apps/vitrine` : Next.js 14 (site public)
- `apps/mobile` : Expo 51 (suivi parents/élèves)
- `packages/shared` : Types et clients Supabase
- `.github/workflows/` : Dossier des workflows CI/CD de GitHub Actions

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

```
EduSmart/
├── .github/workflows/
│   ├── ci.yml                    ← Workflow étendu (lint + type-check + tests + build matrice)
│   ├── e2e.yml                   ← Lancement des tests Playwright sur PR
│   └── deps-audit.yml            ← Audit de sécurité hebdomadaire des dépendances (cron)
├── apps/admin/
│   ├── sentry.client.config.ts   ← Configuration client Sentry
│   ├── sentry.server.config.ts   ← Configuration serveur Sentry
│   ├── sentry.edge.config.ts     ← Configuration edge Sentry
│   ├── instrumentation.ts        ← Hook d'initialisation Sentry pour Next.js
│   └── lib/
│       └── ratelimit.ts          ← Configuration du rate-limiter Upstash Redis
├── apps/vitrine/                 ← Configuration Sentry identique à l'admin
├── apps/mobile/app/_layout.tsx   ← Initialisation de Sentry React Native
└── supabase/functions/
    └── on_school_approved/
        └── index.ts              ← Edge Function Deno (crée l'école et invite son directeur)
```

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez appliquer les modifications suivantes :

### 1. Workflow GitHub Actions Complet (`.github/workflows/ci.yml`)
Étendre le fichier existant pour configurer :
*   Le cache du gestionnaire `pnpm` sur l'agent de build.
*   Les étapes successives : `pnpm lint`, `pnpm -r type-check`, `pnpm test --coverage`.
*   Une matrice de compilation pour builder en parallèle les applications web : `admin`, `vitrine`, et `test`.

### 2. Intégrer le Suivi des Erreurs Sentry
*   **Web (Next.js)** : Lancer le configurateur automatique dans `apps/admin` et `apps/vitrine` :
    ```bash
    pnpm --filter @edusmart/admin add @sentry/nextjs
    npx @sentry/wizard@latest -i nextjs
    ```
    Configurer le fichier `sentry.client.config.ts` avec la variable `process.env.NEXT_PUBLIC_SENTRY_DSN` et un taux d'échantillonnage de traces de `0.1`.
*   **Mobile (Expo)** : Installer et configurer `@sentry/react-native` dans `apps/mobile/app/_layout.tsx` pour intercepter les plantages de l'application sur les téléphones des utilisateurs.

### 3. Protéger les API avec du Rate-limiting Upstash Redis (`apps/admin/src/lib/ratelimit.ts`)
Installer `@upstash/redis` et `@upstash/ratelimit` dans `apps/admin`. Créer la configuration pour limiter :
*   **Génération IA** (`/api/ai/generate`) : maximum 50 requêtes par jour par utilisateur.
*   **Chat** (`/api/chat`) : maximum 10 requêtes par heure par adresse IP (sliding window).
*   Appliquer cette vérification dans le Route Handler : retourner une erreur `429 Quota épuisé / Too Many Requests` si la limite est atteinte.

### 4. Créer la Supabase Edge Function `on_school_approved` (`supabase/functions/on_school_approved/index.ts`)
Développer la fonction Deno :
*   Elle écoute les requêtes HTTP POST issues du webhook de la table `school_requests` lorsque le statut passe à `approved`.
*   Elle utilise le client Supabase Admin pour insérer une nouvelle organisation dans `organizations` avec le slug demandé.
*   Elle envoie une invitation d'inscription au directeur (`supabase.auth.admin.inviteUserByEmail`).
*   Elle insère le profil correspondant dans la table `profiles` avec le rôle `director` lié à la nouvelle école.
*   Déployer la fonction à l'aide de la CLI Supabase : `npx supabase functions deploy on_school_approved`.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  Les Pull Requests déclenchent automatiquement la CI GitHub Actions et s'assurent que le code compile, est propre (lint), et passe l'ensemble des tests.
2.  Une erreur levée volontairement dans l'application web ou mobile remonte de manière détaillée dans le dashboard de surveillance Sentry.
3.  **Test de surcharge** : Appeler en boucle l'API de génération d'IA : le serveur renvoie l'erreur `429` après le dépassement du quota.
4.  **Test d'inscription B2B** : Mettre à jour une demande d'inscription d'école à `status = 'approved'` dans Supabase : l'Edge Function crée automatiquement l'école, invite le directeur par e-mail, et crée son profil d'accès directeur.
5.  Les analyses d'audience privées (Plausible) sont configurées et affichent les visites.
