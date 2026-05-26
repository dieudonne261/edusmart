# Rapport d'Analyse et d'Avancement du Projet EduSmart

## 📖 Introduction & Vision du Projet

Le projet **EduSmart** est une plateforme SaaS multi-tenant moderne destinée à la gestion des établissements scolaires et à l'apprentissage adaptatif assisté par Intelligence Artificielle. Conçu par **Randrianarison Dieu Donné** pour son mémoire de Master en Informatique à l'**Université Adventiste Zürcher (UAZ)**, ce projet répond aux besoins spécifiques de modernisation des écoles à Madagascar puis, à terme, dans toute l'Afrique francophone.

### Objectifs Majeurs
*   **Centralisation et Multi-établissement (SaaS Multi-tenant)** : Héberger plusieurs écoles de manière isolée sur le plan des données (via Supabase RLS) mais mutualisée sur le plan de l'infrastructure web.
*   **Pédagogie Moderne & IA** : Aider les enseignants à générer des cours et des quiz personnalisés, et identifier de manière précoce le décrochage scolaire (grâce aux modèles d'IA hébergés sur OpenRouter).
*   **Mobilité & Accessibilité** : Offrir des applications mobiles dédiées aux parents (suivi des notes) et aux enfants (mini-jeux et apprentissage gamifié), ainsi qu'une application bureau Electron pour le secrétariat en mode hors-ligne.

---

## 🏗️ Architecture Technique et Monorepo

Le projet est structuré sous la forme d'un **Monorepo** géré par **Turborepo** avec le gestionnaire de paquets **pnpm**. Cette structure permet de partager efficacement le code de la base de données, l'authentification et les composants d'interface graphique entre les 6 applications du projet.

### Structure du Code source

```
EduSmart/
├── apps/
│   ├── vitrine/          # Next.js 14 — Site marketing + Portails publics des écoles
│   ├── admin/            # Next.js 14 — Portail d'administration (directeurs/profs)
│   ├── desktop/          # Electron 30 + Vite + React — Application secrétariat offline
│   ├── mobile/           # Expo 51 (React Native) — Application parents/élèves
│   ├── kids/             # Expo 51 (React Native) — App enfants 6-14 ans gamifiée
│   └── test/             # Next.js 14 — Sandbox de debug DNS et middleware (Live)
├── packages/
│   ├── shared/           # Code métier partagé (types TS, clients/helpers Supabase)
│   └── ui/               # Design System (tokens CSS, variables de style)
├── docs/                 # Documentation structurée (30+ fichiers markdown)
├── prompts/              # Prompts d'exécution Claude (générés pour ce rapport)
└── tasks/                # Fichiers de définition des 15 étapes techniques
```

---

## 🌐 Multi-tenancy & Résolution DNS

L'isolation des établissements est assurée par un système de **sous-domaines dynamiques** :
1.  **Vitrine Racine** (`edusmart.site`) : Site marketing général avec un CTA "Inscrire mon école".
2.  **Vitrines d'Écoles** (`<slug>.edusmart.site`) : Site public propre à chaque école (ex: `strelitzia.edusmart.site`, `uaz.edusmart.site`) avec thèmes personnalisés.
3.  **Portail Admin** (`<slug>.edusmart.site/admin` ou portail admin général) : Espace de gestion réservé aux directeurs, secrétaires et enseignants de l'école concernée.

### Mécanisme de résolution (Middleware Next.js)
Un middleware intercepte chaque requête, extrait le sous-domaine (`host`) et injecte un header personnalisé `x-school-slug` destiné aux Server Components. Ce slug permet de charger l'organisation correspondante depuis la base de données.

---

## 📋 Analyse des fichiers Markdown (`.md`) à la racine

Un examen approfondi des fichiers de documentation et des historiques de conversation présents dans le projet révèle les informations clés suivantes :

### 1. `README.md`
Présentation minimale du monorepo Turborepo contenant les 6 applications et décrivant les commandes pour installer (`pnpm install`) et lancer en dev (`pnpm dev`).

### 2. `afraire.md` (À faire)
Une feuille de route décrivant les tâches immédiates d'infrastructure à configurer sur les consoles d'administration (Supabase, Vercel, LWS) :
*   Invitation du compte UAZ sur Supabase (`randrianarison.d@zurcher.edu.mg`).
*   Création et configuration du projet Vercel `edusmart-vitrine` pointant vers `apps/vitrine` avec ses variables d'environnement.
*   Attachement du domaine wildcard `*.edusmart.site` chez LWS.
*   Configuration des URLs de redirection d'authentification Supabase.
*   État actuel des livrables : Schéma DB, RLS, Code d'Auth et typecheck OK.

### 3. `RAPPORT_ACTIVITE_DESKTOP.md`
Rapport de l'audit et des corrections appliquées sur l'application bureau Electron :
*   **Correction de l'écran blanc** en production en forçant `base: './'` dans `apps/desktop/vite.config.ts`.
*   Fix du packaging local sous Windows en désactivant `signAndEditExecutable` (conflit de liens symboliques).
*   Création d'un script `ensure-electron.cjs` pour télécharger automatiquement le binaire Electron s'il manque.
*   Fixation du port de dev Vite (`strictPort`) pour éviter le décalage de port (Electron s'attendait au port 5173 mais Vite démarrait sur 5174).
*   Mise en place d'une interface dashboard de secrétariat shadcn sobre, adaptative (mode sombre/clair) et réactive.

### 4. `prompt_monorepo_edusmart.md`
Prompt d'origine complet ayant servi à poser les fondations et le squelette du monorepo, configurer les fichiers racines (`package.json`, `pnpm-workspace.yaml`, `turbo.json`), et initialiser/déployer l'application `apps/test`.

### 5. `EduSmart_VibeCoding_Guide.md`
Guide méthodologique complet de développement assisté par IA ("Vibe Coding") adapté au projet :
*   **Philosophie** : "1 session = 1 tâche = 1 commit" (éviter de modifier trop de fichiers à la fois).
*   Règles de sécurité : Interdiction absolue de commiter des secrets réels.
*   Directives de typage strict et gestion des bases de données RLS.

### 6. Les exports de conversations (`Export_Conversation_EduSmart 1 & 2.md`, `Export généré.md`, `Export V3 Final généré.md`)
Historique complet des sessions de travail précédentes avec l'IA. Ils tracent les choix de conception de la base de données (30 tables), la mise en place de la RLS multi-tenant, et la planification de la roadmap finale en 15 étapes séquentielles.

---

## 🚦 État d'Avancement des 15 Étapes Techniques

Le projet suit une roadmap de 15 étapes conçue pour amener le projet d'une version maquettée (5.5/10) à une version de production stable et testée (8.3/10).

| Étape | Description | Statut | Détails |
|---|---|---|---|
| **STEP_01** | Schéma Supabase complet | **TERMINÉ** ✅ | 33 tables, RLS active, buckets et seed de données mis en place. |
| **STEP_02** | Sécurisation des secrets | **TERMINÉ** ✅ | Audit effectué, clés sensibles purgées et `.env.example` propre. |
| **STEP_03** | Client Supabase partagé | **TERMINÉ** ✅ | Intégration dans `@edusmart/shared` avec types autogénérés. |
| **STEP_04** | Auth réelle (Supabase) | 📋 En attente | Remplacement du login mock de l'admin par les sessions Supabase. |
| **STEP_05** | Vitrine connectée | 📋 En attente | Remplacement de la data mockée dans la vitrine par la DB. |
| **STEP_06** | Admin connecté | 📋 En attente | Connexion des listes d'élèves, saisie des notes et settings. |
| **STEP_07** | IA OpenRouter streaming | 📋 En attente | Route handler SSE et prompts d'IA pour les cours et les quiz. |
| **STEP_08** | App mobile Expo | 📋 En attente | Login, navigation par onglets et affichage des notes. |
| **STEP_09** | App kids Expo gamifiée | 📋 En attente | Mode QR Code, QCM et mini-jeux pour les enfants. |
| **STEP_10** | Sync offline Desktop SQLite | 📋 En attente | Base de données better-sqlite3 locale et synchronisation auto. |
| **STEP_11** | Bulletins PDF | 📋 En attente | Moteur de rendu @react-pdf/renderer et impression locale. |
| **STEP_12** | Notifications push | 📋 En attente | Push via Expo Notifications et Webhooks Supabase. |
| **STEP_13** | Tests automatisés | 📋 En attente | Tests unitaires Vitest et tests de flux E2E avec Playwright. |
| **STEP_14** | CI étendue & monitoring | 📋 En attente | Setup GitHub Actions complet, intégration Sentry et rate-limiting. |
| **STEP_15** | Déploiement production | 📋 En attente | Onboarding école pilote, migration edusmart.mg et soumission stores. |

---

## 🚀 Prochaines Actions

1.  **Initialiser le dossier de prompts** : Nous avons créé le dossier `prompts/` à la racine contenant les prompts individuels pour chaque étape.
2.  **Exécuter l'étape 4** : Copier-coller le prompt de `prompts/STEP_04_auth_real.md` dans Claude pour connecter l'authentification de l'administration.
3.  **Suivre l'avancement** avec la checklist du fichier `task.md`.
