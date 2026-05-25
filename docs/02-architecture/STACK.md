# STACK — EduSmart

> Stack technologique complète, versions, raisons de choix, alternatives écartées.

---

## 1. Vue synthétique

| Couche | Technologie | Version | Pourquoi |
|---|---|---|---|
| **Package manager** | pnpm | 9.x | Workspaces natifs, deduplication agressive, vitesse |
| **Monorepo build** | Turborepo | 2.9.x | Cache local + distant, parallélisation, déjà installé |
| **Langage** | TypeScript | 5.9 / 5.3 (Vite) | Type safety bout en bout, strict mode obligatoire |
| **Web framework** | Next.js | 14.2 (App Router) | RSC, middleware natif, Vercel-first |
| **UI runtime** | React | 18.2 | Standard, Server Components |
| **CSS** | Tailwind CSS | 3.4 | Utility-first, theming dynamique via CSS vars |
| **UI kit** | Shadcn/ui | latest | Composants accessibles, pas de runtime |
| **Mobile** | Expo SDK | 51 (React Native 0.74) | EAS builds, OTA, Expo Router |
| **Desktop** | Electron | 30.5 | Offline + impression native + SQLite |
| **Desktop bundler** | Vite | 5.4 | Build rapide, HMR, support natif TS |
| **Desktop packaging** | electron-builder | 24.13 | Cross-platform, signature désactivée Windows |
| **Backend tout-en-un** | Supabase | hosted | PostgreSQL + Auth + RLS + Realtime + Storage + Edge Functions |
| **DB driver** | @supabase/supabase-js | 2.105 | SDK officiel |
| **DB SSR helper** | @supabase/ssr | latest | Server Components + cookies |
| **IA** | OpenRouter | hosted | Multi-modèles (Claude, Mistral), fallback, coûts maîtrisés |
| **Email transactionnel** | Resend | hosted | API simple, 3000 mails/mois gratuits, region EU |
| **Email métier** | LWS Mail | hosted | Inclus dans pack domaine, `mail.edusmart.site` |
| **SMS** | Africa's Talking | hosted | Tarifs locaux Madagascar (préféré à Twilio) |
| **Hébergement web** | Vercel | hosted | Wildcard `*.edusmart.site` natif, preview deploys |
| **DNS / domaine** | LWS | hosted | NS `ns21..ns24.lwsdns.com` conservés |
| **Storage offline** | better-sqlite3 _(prévu)_ | latest | SQLite synchrone, simple, fiable |
| **Storage Electron** | electron-store _(prévu)_ | latest | Préfs + session chiffrée |
| **Mobile secure store** | expo-secure-store | 13.x | Keychain iOS / Keystore Android |
| **Kids local storage** | react-native-mmkv | 2.x | Chiffré, rapide |

---

## 2. Stack web (Next.js apps : admin, vitrine, test)

```
@edusmart/admin
├── next             14.2.x       ← App Router
├── react / react-dom 18.2.x
├── typescript       5.9.x         ← strict
├── tailwindcss      3.4.x
├── @edusmart/shared workspace:*   ← types + supabase client + utils
└── @edusmart/ui     workspace:*   ← tokens design
```

### Conventions
- **App Router exclusivement** (pas de `pages/`).
- **Server Components par défaut**, `'use client'` uniquement quand nécessaire.
- **Server Actions** pour les mutations (pas d'API REST custom sauf besoin spécifique).
- **Streaming + Suspense** pour les pages lourdes (dashboard, news).
- **ISR** (`revalidate: 60`) pour les pages publiques de la vitrine.

---

## 3. Stack mobile (Expo apps : mobile, kids)

```
@edusmart/mobile
├── expo                51.0.x
├── react-native        0.74.x
├── expo-router         3.x         ← file-based routing
├── @supabase/supabase-js 2.105.x
├── @react-native-async-storage  ← AsyncStorage (cache léger)
├── expo-secure-store   ← session tokens
└── (kids) react-native-mmkv ← stockage chiffré
```

### Build
- **EAS Build** (cloud) — pas de local Xcode/Android Studio requis.
- **OTA updates** via `expo-updates` pour patcher sans store review.

---

## 4. Stack desktop (Electron app)

```
@edusmart/desktop
├── electron         30.5.x
├── electron-builder 24.13.x
├── vite             5.4.x         ← bundle renderer
├── @vitejs/plugin-react 4.x
├── react            18.2.x
├── tailwindcss      3.4.x
├── better-sqlite3   prévu          ← stockage offline
└── electron-store   prévu          ← préfs + session
```

### Particularités déjà résolues
- `base: './'` dans `vite.config.ts` (sinon fenêtre blanche en prod).
- `strictPort: true` (Electron attend 5173 fixe).
- `signAndEditExecutable: false` (erreur symlinks Windows).
- Script `scripts/ensure-electron.cjs` pour réparer les binaires manquants.

---

## 5. Stack backend (Supabase)

| Service Supabase | Usage |
|---|---|
| **PostgreSQL** | 12 tables métier + RLS |
| **Auth** | Email/password, Magic Link, Google OAuth |
| **RLS** | Isolation tenant par `organization_id` |
| **Realtime** | Notifications push (notes, messages) |
| **Storage** | Logos écoles, avatars, PDFs bulletins |
| **Edge Functions** | `on_school_approved`, cron détection décrochage |

### Plan
- **Free tier** pour démarrer (500 MB DB, 5 GB bandwidth, 50k MAU).
- Migration **Pro** ($25/mois) quand >50k MAU ou besoin de backup automatique.

---

## 6. Stack IA (OpenRouter)

```
fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
  body: JSON.stringify({
    model: 'anthropic/claude-3-haiku',  // ou autres
    messages: [...],
    stream: true,
  }),
})
```

| Modèle | Usage | Coût indicatif |
|---|---|---|
| `mistralai/mistral-7b-instruct` | Chat anonyme, communications parents | ~$0.07 / 1M tokens |
| `anthropic/claude-3-haiku` | Génération leçons, appréciations, détection décrochage | ~$0.25 / 1M tokens |
| `anthropic/claude-3-5-sonnet` | Analyse de classe (rapports profonds) | ~$3 / 1M tokens |

> Budget cible : **<5€/mois pour 100 utilisateurs actifs** en phase pilote.

---

## 7. Stack qualité (prévu)

| Besoin | Outil prévu | Phase |
|---|---|---|
| Lint JS/TS | ESLint 8 + `eslint-config-next` | déjà installé |
| Format | Prettier 3 | déjà installé |
| Tests unitaires | Vitest | P2 |
| Tests composants | Vitest + Testing Library | P2 |
| Tests E2E | Playwright | P3 |
| Bundle analysis | `@next/bundle-analyzer` | P3 |
| Monitoring erreurs | Sentry | P3 |
| Analytics | Vercel Analytics + Plausible (privacy-first) | P3 |
| Pre-commit | Husky + lint-staged | P2 |

---

## 8. Stack CI/CD

```
GitHub Actions (.github/workflows/ci.yml)
├── Node 20
├── pnpm 9
├── pnpm install --frozen-lockfile
└── @edusmart/test : type-check + build
```

> 🟡 À étendre P2 : admin, vitrine, desktop, mobile, lint, tests.

---

## 9. Alternatives écartées (résumé — détail dans les ADR)

| Choix retenu | Alternative écartée | Raison |
|---|---|---|
| Turborepo + pnpm | Multi-repos / npm | Code partagé, cache build ([ADR-001](../13-decisions/ADR-001-monorepo.md)) |
| Next.js 14 App Router | Pages Router / SPA Vite | Server Components + middleware natif ([ADR-002](../13-decisions/ADR-002-nextjs-app-router.md)) |
| Supabase | Backend Node + Postgres custom | Tout-en-un, gratuit pour démarrer ([ADR-003](../13-decisions/ADR-003-supabase.md)) |
| Multi-tenancy sous-domaine | Path-based `/strelitzia/...` | URL pro, cookies isolés ([ADR-004](../13-decisions/ADR-004-multi-tenancy.md)) |
| OpenRouter | OpenAI direct | Multi-modèles, coûts plus bas ([ADR-005](../13-decisions/ADR-005-openrouter.md)) |
| Expo | React Native CLI | EAS cloud, OTA ([ADR-006](../13-decisions/ADR-006-expo.md)) |
| Electron | PWA installable | Offline robuste + SQLite + impression ([ADR-007](../13-decisions/ADR-007-electron.md)) |
| 1 Google OAuth | 1 par école | Évite multiplication apps Google ([ADR-008](../13-decisions/ADR-008-google-oauth-unique.md)) |
| Vercel | Netlify / Cloudflare Pages | Wildcard natif ([ADR-009](../13-decisions/ADR-009-vercel.md)) |
| DNS LWS conservé | NS Vercel | Garder LWS Mail ([ADR-010](../13-decisions/ADR-010-dns-lws.md)) |

---

## 10. Versions actuellement installées (extrait `pnpm-lock.yaml`)

```
node                  v20.x
pnpm                  9.x
turbo                 2.9.14
next                  14.2.x
react                 18.2.0
typescript            5.9.3 / 5.3.3 (desktop)
tailwindcss           3.4.19
electron              30.5.1
@vitejs/plugin-react  4.7.0
vite                  5.4.21
expo                  51.0.39
@supabase/supabase-js 2.105.4
```

> Mises à jour à planifier : `electron` 30 → 32, `next` 14.2 → 15 (en P3, après stabilisation).

---

## Liens

- 🏗️ [ARCHITECTURE](ARCHITECTURE.md)
- ⚙️ [SETUP_GUIDE](../03-setup/SETUP_GUIDE.md)
- 🔐 [ENV_VARIABLES](../03-setup/ENV_VARIABLES.md)
- 🧠 [Décisions ADR](../13-decisions/)
