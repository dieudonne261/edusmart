# SETUP GUIDE — EduSmart

> Comment installer, configurer et lancer le monorepo EduSmart en local, de zéro à un environnement de développement fonctionnel.

---

## 1. Pré-requis

| Outil | Version | Installation |
|---|---|---|
| **Node.js** | 20.x LTS | https://nodejs.org/ (ou `nvm install 20`) |
| **pnpm** | 9.x | `npm install -g pnpm` |
| **Git** | 2.40+ | https://git-scm.com/ |
| **Compte Supabase** | gratuit | https://supabase.com/ |
| **Compte Vercel** | gratuit | https://vercel.com/ |
| **Compte Resend** | gratuit | https://resend.com/ |
| **Compte OpenRouter** | crédit minimal | https://openrouter.ai/ |
| **Compte Google Cloud** | gratuit | pour OAuth ([STEP_04](../../tasks/STEP_04.md)) |

### Spécifique mobile
- **Expo Go** sur smartphone (iOS/Android) pour tester sans build natif.
- **Compte Expo** (gratuit) pour EAS builds.

### Spécifique desktop
- Windows : aucun outil supplémentaire.
- macOS : Xcode CLI tools (`xcode-select --install`).
- Linux : `libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils` (Debian/Ubuntu).

---

## 2. Cloner le repo

```bash
git clone https://github.com/dieudonne261/EduSmart.git
cd EduSmart
```

---

## 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` et remplir avec les valeurs réelles ([ENV_VARIABLES.md](ENV_VARIABLES.md) pour la liste complète) :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
OPENROUTER_API_KEY=<your-openrouter-key>
RESEND_API_KEY=<your-resend-key>
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL=https://edusmart.site/auth/callback
```

> ⚠️ **Jamais** commiter `.env`. Vérifier `.gitignore`.

---

## 4. Installer les dépendances

```bash
pnpm install
```

Cette commande installe **toutes** les apps et packages en parallèle (workspace pnpm).

> En cas d'erreur Electron sur Windows ("electron.exe missing") : lancer `pnpm --filter @edusmart/desktop run predev` qui exécute `scripts/ensure-electron.cjs` pour réparer.

---

## 5. Initialiser Supabase (la première fois uniquement)

Suivre [STEP_01.md](../../tasks/STEP_01.md) :
1. Créer le projet Supabase (région Singapore).
2. Exécuter les migrations SQL (`supabase/migrations/*.sql`).
3. Seed des données test (STRELITZIA + UAZ).
4. Configurer Auth (Site URL, Redirect URLs, SMTP Resend).
5. Récupérer les 3 clés et les mettre dans `.env`.

---

## 6. Lancer en développement

### Toutes les apps en parallèle (recommandé)

```bash
pnpm dev
```

| App | Port | URL locale |
|---|---|---|
| `vitrine` | 3001 | http://localhost:3001 |
| `admin` | 3002 | http://localhost:3002 |
| `test` | 3005 | http://localhost:3005 |
| `desktop` | 5173 (Vite) + Electron | fenêtre auto |
| `mobile` / `kids` | Expo Metro 19000+ | Expo Go |

### Une seule app à la fois

```bash
pnpm --filter @edusmart/vitrine dev
pnpm --filter @edusmart/admin dev
pnpm --filter @edusmart/desktop dev
pnpm --filter @edusmart/mobile start
pnpm --filter @edusmart/kids start
```

### Tester le multi-tenant en local

Le middleware lit `?school=<slug>` en localhost :

```
http://localhost:3001                       → mode marketing global (root)
http://localhost:3001?school=strelitzia     → vitrine STRELITZIA (vert/or)
http://localhost:3001?school=uaz            → vitrine UAZ (violet/jaune)
http://localhost:3002?school=strelitzia     → admin STRELITZIA
```

---

## 7. Build production

```bash
# Web — Vercel s'en charge automatiquement, mais en local :
pnpm --filter @edusmart/vitrine build
pnpm --filter @edusmart/admin build

# Desktop — produit un .exe / .dmg / .AppImage :
pnpm --filter @edusmart/desktop build
# Output dans apps/desktop/release/

# Mobile — via EAS (cloud) :
pnpm --filter @edusmart/mobile exec eas build --platform ios
pnpm --filter @edusmart/mobile exec eas build --platform android
```

---

## 8. Type-check et lint

```bash
# Type-check toutes les apps
pnpm -r type-check

# Lint global
pnpm lint
```

---

## 9. Tests (Phase P2)

```bash
pnpm test               # vitest tous les packages
pnpm test:e2e           # Playwright (apps web)
```

> Actuellement aucun test n'existe — voir [STEP_13](../../tasks/STEP_13.md).

---

## 10. Dépannage rapide

| Symptôme | Solution |
|---|---|
| `Cannot find module '@edusmart/shared'` | `pnpm install` à la racine, puis vérifier `packages/shared/package.json` `name` |
| Electron démarre sur fenêtre blanche | Vérifier `apps/desktop/vite.config.ts` contient `base: './'` |
| Vite démarre sur un port différent que 5173 | Vérifier `strictPort: true` dans `vite.config.ts` |
| Erreur Windows symlinks pendant build Electron | Vérifier `signAndEditExecutable: false` dans `package.json` de `apps/desktop` |
| Page admin redirige toujours vers `/login` | Cookies Supabase mal propagés — vérifier `updateSupabaseSession` dans le middleware |
| Slug `xyz` retombe sur STRELITZIA en localhost | Comportement attendu (fallback) — voir [middleware](../02-architecture/ARCHITECTURE.md#3-multi-tenancy-par-sous-domaine) |
| RLS bloque toutes les queries en local | Vérifier que le `profile` a bien un `organization_id` et que le user est connecté |
| Email confirmation Supabase pas reçu | Vérifier SMTP Resend dans Auth settings + spam |

---

## 11. Workflow git recommandé

```bash
git checkout -b feature/<nom-court>
# ... coder ...
pnpm dev                                 # tester en local
pnpm -r type-check && pnpm lint          # CI-like
git add -p                               # staging sélectif
git commit -m "feat(admin): add students filter"
git push -u origin feature/<nom-court>
# Ouvrir PR → review → merge vers develop
```

> Convention : `feat:` `fix:` `chore:` `docs:` `refactor:` `test:`.

---

## 12. Liens utiles

- 📦 [STACK](../02-architecture/STACK.md) — Détail des versions et raisons
- 🔐 [ENV_VARIABLES](ENV_VARIABLES.md) — Toutes les variables
- 🚀 [DEPLOYMENT](../09-deployment/DEPLOYMENT.md) — Mise en production
- 📌 [tasks/STEP_01](../../tasks/STEP_01.md) — Première étape exécutable
- 🗂️ [MASTER_INDEX](../MASTER_INDEX.md)
