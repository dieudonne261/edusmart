# CURRENT STATE — EduSmart

> Inventaire **factuel** de ce qui est réellement implémenté dans le repo au 2026-05-25.
> Cette page distingue : **codé & fonctionnel ✅** / **codé avec mock 🟡** / **non implémenté 🔴** / **dette technique ⚠️**.

---

## 1. Vue d'ensemble

| Couche | Codé ✅ | Mock 🟡 | Manquant 🔴 |
|---|---|---|---|
| Monorepo (Turborepo + pnpm) | Workspace, scripts, CI minimale | — | — |
| Infra DNS / domaine | LWS + Vercel + wildcard | — | Migration future `edusmart.mg` |
| `apps/test` | Déployée sur `test.edusmart.site` | — | — |
| `apps/vitrine` | Routes, layout, composants UI, middleware | Toutes les données | Auth, Supabase, vraies pages |
| `apps/admin` | Routes, sidebar, table élèves, middleware | Login, IA, data | Auth Supabase, vraies données |
| `apps/desktop` | Dashboard shadcn complet, build Electron | Données statiques | IPC, sync SQLite ↔ Supabase, impression PDF |
| `apps/mobile` | `package.json` Expo | — | Tout le code |
| `apps/kids` | `package.json` Expo | — | Tout le code |
| `packages/shared` | Types, slugify, gradeCalc, mocks | Données | Client Supabase, hooks |
| `packages/ui` | Tokens couleurs/fonts | — | Tous les composants |
| Supabase | — | — | Projet, tables, RLS, Auth, Storage, Edge Functions |
| OpenRouter / IA | — | Route mock `/api/ai/generate` | Appels réels |
| Resend / Twilio | Déclarés `.env.example` | — | Aucun usage |

---

## 2. Détail par application

### 2.1 `apps/test` — ✅ Déployée
- **Statut** : Live sur `test.edusmart.site` depuis le 17/05/2026.
- **Rôle** : valider DNS, wildcard, middleware multi-tenant en environnement Vercel réel.
- **CI** : seul projet couvert par `.github/workflows/ci.yml` (build + type-check sur push `main`/`develop`).

### 2.2 `apps/vitrine` — 🟡 Squelette riche, data mockée

| Élément | État | Note |
|---|---|---|
| `middleware.ts` | ✅ | Extrait slug, gère `__root__`, support `?school=` en localhost |
| `src/app/page.tsx` | 🟡 | Dual-mode (marketing root + showcase école) — data depuis `@edusmart/shared/mocks` |
| `src/app/about/page.tsx` | 🟡 stub | Présent mais minimal |
| `src/app/programs/page.tsx` | 🟡 stub | Idem |
| `src/app/news/page.tsx` | 🟡 stub | Idem |
| `src/app/contact/page.tsx` | 🟡 stub | Idem |
| `src/app/api/contact/route.ts` | 🟡 | POST → redirect 303 `?sent=1` — pas d'envoi email réel |
| `src/components/school-shell.tsx` | ✅ | Header, nav 5 onglets, footer, theming dynamique |
| `src/lib/tenant.ts` | ✅ | `getTenantContext()` + `schoolHref()` |
| ChatWidget IA | 🔴 | Pas implémenté |
| Auth (parents) | 🔴 | Pas implémentée |
| **Connexion Supabase** | 🔴 | **0 ligne réelle, tout est mock** |

### 2.3 `apps/admin` — 🟡 Squelette + login factice

| Élément | État | Note |
|---|---|---|
| `middleware.ts` | ✅ | Multi-tenancy ; fallback silencieux à `strelitzia` si slug invalide ⚠️ |
| `src/app/page.tsx` | 🟡 | Dashboard KPI + alertes — data mockée |
| `src/app/login/page.tsx` | 🔴 | **Login hardcodé** : `directeur@strelitzia.test` / `Test1234!` |
| `src/app/students/page.tsx` | 🟡 | Table élèves + statuts (`active` / `watch` / `inactive`) — mock |
| `src/app/grades/page.tsx` | 🔴 | Page stub |
| `src/app/ai-tools/page.tsx` | 🔴 | Page stub |
| `src/app/settings/page.tsx` | 🔴 | Page stub |
| `src/app/api/ai/generate/route.ts` | 🟡 | Renvoie un outline JSON fictif (pas d'appel OpenRouter) |
| `src/components/admin-shell.tsx` | ✅ | Sidebar 5 onglets + header |
| `src/lib/admin-tenant.ts` | ✅ | Résout tenant depuis `x-school-slug` |
| **Auth réelle, RLS, sessions** | 🔴 | **Aucune** |

### 2.4 `apps/desktop` — ✅ UI complète, ❌ logique métier

Le rapport `RAPPORT_ACTIVITE_DESKTOP.md` (2026-05-24) confirme :
- ✅ `App.tsx` (~1000 lignes) : sidebar collapsible, dashboard shadcn, 4 métriques, queue tâches (onglets Aujourd'hui/En retard), table élèves, switch dark/light.
- ✅ Build Electron réparé (3 bugs corrigés — voir [BUGS_AND_FIXES](../12-bugs/BUGS_AND_FIXES.md) à générer) :
  - `base: './'` dans `vite.config.ts` (fenêtre blanche en prod).
  - `signAndEditExecutable: false` dans `electron-builder` (erreur symlinks Windows).
  - `strictPort: true` (Vite ne change plus de port).
  - Script `scripts/ensure-electron.cjs` qui répare automatiquement les binaires manquants avant `dev`.
- 🔴 **Aucune intégration IPC** (`ipcMain` / `ipcRenderer`) — pas d'accès filesystem.
- 🔴 **Aucune base SQLite locale** (zone "Synchro" préparée dans l'UI, vide).
- 🔴 **Aucune connexion Supabase** (donc pas de sync).
- 🔴 **Impression bulletins PDF** non implémentée.

### 2.5 `apps/mobile` & `apps/kids` — 🔴 Stubs Expo
- `package.json` Expo SDK 51 + React Native 0.74.
- Aucun code métier (`App.tsx` par défaut Expo).
- Décisions architecturales prises ([ARCHITECTURE](../02-architecture/ARCHITECTURE.md)) mais 0 ligne écrite.

---

## 3. Détail des packages

### 3.1 `packages/shared` — 🟡 Types & mocks OK, ❌ Supabase

```
packages/shared/src/
├── index.ts                  ✅ Exports centralisés
├── types/
│   ├── organization.ts       ✅ Organization, Program, NewsArticle
│   ├── student.ts            ✅ Student (status, attendanceRate…)
│   └── grade.ts              ✅ Grade (score, max, coefficient)
├── mock-data.ts              🟡 ORGANIZATIONS (Strelitzia, UAZ), PROGRAMS×4, NEWS×3, STUDENTS, getters
├── utils/
│   ├── slugify.ts            ✅
│   └── gradeCalc.ts          ✅ calculateAverage() avec coefficients
├── hooks/                    🔴 vide (.gitkeep)
└── supabase/                 🔴 vide (.gitkeep)
```

**Problème majeur** : dépendance `@supabase/supabase-js@2.43` déclarée mais **aucun client n'est instancié**. Toutes les apps consomment `mock-data.ts`.

### 3.2 `packages/ui` — 🟡 Tokens seulement

- `src/index.ts` : exports `COLORS` et `FONTS`.
- `/components/` : vide (`.gitkeep`).
- **Conséquence** : `AdminShell` et `SchoolShell` sont **dupliqués** entre `apps/admin` et `apps/vitrine` au lieu d'être centralisés ici.

---

## 4. Configuration & secrets

| Fichier | État | Risques |
|---|---|---|
| `.env` (racine) | Présent, **non versionné** | OK |
| `.env.example` | Versionné, contient des **clés réelles JWT Supabase, OpenRouter, Resend, Twilio** | 🔴 **LEAK POTENTIEL** |
| `package.json` (racine) | ✅ scripts `dev`, `build`, `lint` |   |
| `pnpm-workspace.yaml` | ✅ `apps/*` + `packages/*` |   |
| `turbo.json` | ✅ cache build/dev |   |
| `.github/workflows/ci.yml` | 🟡 ne couvre que `@edusmart/test` |   |
| `tsconfig` racine | 🔴 Absent (chaque app a le sien) |   |
| `.claude/settings.json` | ⚠️ Référence `claude-opus-4-5` (modèle obsolète/inexistant) — passer à `claude-opus-4-7` |

---

## 5. Incohérences techniques détectées

| # | Incohérence | Sévérité | Impact |
|---|---|---|---|
| 1 | Secrets réels dans `.env.example` | 🔴 Critique | Fuite potentielle si repo public |
| 2 | `@supabase/supabase-js` installé mais 0 client instancié | 🔴 Majeur | Toute persistance impossible |
| 3 | Login admin hardcodé `directeur@strelitzia.test` | 🔴 Critique | Admin accessible à tous |
| 4 | Middleware fallback silencieux sur slug invalide → `strelitzia` | 🟡 Moyen | Fuite cross-tenant en cas de typo |
| 5 | `AdminShell` & `SchoolShell` dupliqués entre apps | 🟡 Moyen | Maintenance double |
| 6 | `packages/ui` quasi vide alors qu'il devrait centraliser les composants | 🟡 Moyen | DRY violé |
| 7 | CI ne couvre que `apps/test` (pas admin/vitrine/desktop) | 🟡 Moyen | Régressions non détectées |
| 8 | Aucun test unitaire ni E2E | 🟡 Moyen | Refactors risqués |
| 9 | 5 fichiers `Export*.md` non commités à la racine | 🟢 Mineur | Pollution dépôt — devraient aller dans `docs/17-ai-analysis/` |
| 10 | `package-lock.json` ET `pnpm-lock.yaml` coexistent (npm + pnpm) | 🟡 Moyen | Risque de désync deps — choisir un seul package manager |
| 11 | `apps/mobile` et `apps/kids` sont des stubs sans roadmap S4/S5 démarrée | 🟢 Mineur | À planifier |
| 12 | Modèle Claude Code obsolète dans settings (`claude-opus-4-5`) | 🟢 Mineur | À actualiser à `claude-opus-4-7` |

---

## 6. Dette technique identifiée

1. **Authentification absente** — tout le projet repose sur un mock. C'est le **blocker n°1**.
2. **Pas de persistance réelle** — toute démo se base sur 2 écoles + ~10 élèves codés en dur.
3. **Pas de tests** — aucun garde-fou contre les régressions, en particulier au moment de brancher Supabase.
4. **Duplication des shells** — facilement extractibles dans `packages/ui` une fois la stack stabilisée.
5. **Secrets exposés** — à régénérer avant tout `git push` public.
6. **Documentation éparpillée** — 5 exports `.md` à la racine + le présent travail. À consolider sous `docs/`.
7. **Coexistence npm/pnpm** — choisir pnpm (déclaré dans `pnpm-workspace.yaml`) et supprimer `package-lock.json`.

---

## 7. Fichiers morts / suspects à confirmer

> ⚠️ **Aucune suppression automatique** — ces fichiers méritent une revue manuelle avant action.

| Fichier | Raison du soupçon | Action proposée |
|---|---|---|
| `package-lock.json` | Coexiste avec `pnpm-lock.yaml` | Supprimer après confirmation |
| `Export V3 Final généré.md`, `Export généré.md`, `Export_Conversation_EduSmart 1.md`, `Export_Conversation_EduSmart 2.md`, `EduSmart_VibeCoding_Guide.md`, `prompt_monorepo_edusmart.md`, `RAPPORT_ACTIVITE_DESKTOP.md`, `2026-05-25___backup_zone_edusmart.site.txt` | Pollution racine, devraient être dans `docs/17-ai-analysis/` ou `docs/13-decisions/` | Déplacer (Phase 2) |
| `packages/shared/src/hooks/.gitkeep` | Dossier vide | Garder tant que pas de hook |
| `packages/shared/src/supabase/.gitkeep` | Dossier vide | À remplir prioritairement (STEP_03) |
| `packages/ui/src/components/.gitkeep` | Dossier vide | À remplir Phase 2/3 |

---

## 8. Sécurité — synthèse

> Détail complet dans [SECURITY_REPORT](../14-security/SECURITY_REPORT.md) _(à générer Phase 2)_.

- 🔴 Secrets dans `.env.example` → **régénérer toutes les clés exposées**.
- 🔴 Login admin hardcodé.
- 🔴 RLS Supabase non en place (rien à protéger encore).
- 🟡 Pas de rate-limit (ex : `/api/chat` futur).
- 🟡 Pas de validation d'input (forms, API).
- 🟡 Middleware fallback silencieux (peut être exploité par typo de slug).

---

## 9. Performance — observations

> Détail complet dans [PERFORMANCE_REPORT](../15-performance/PERFORMANCE_REPORT.md) _(à générer Phase 2)_.

- Bundles Next.js non mesurés (pas de `@next/bundle-analyzer`).
- Aucun cache HTTP/CDN spécifique pour les API.
- `App.tsx` desktop est un fichier monolithique (1000+ lignes) — splitter en composants une fois la logique métier ajoutée.
- Pas d'images optimisées pour la vitrine (Unsplash remote en `next.config.mjs`, prévoir `next/image`).

---

## 10. Prochaines actions

→ [NEXT_ACTIONS](../10-roadmap/NEXT_ACTIONS.md) pour la priorisation P0–P3.
→ [/tasks/STEP_01.md](../../tasks/STEP_01.md) pour la première étape exécutable.

---

_Source : scan exhaustif du repo (hors `node_modules`, `.turbo`, `dist`) + cross-check avec les 8 exports IA. État arrêté au 2026-05-25._
