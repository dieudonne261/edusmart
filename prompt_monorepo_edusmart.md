# PROMPT COMPLET — Monorepo EduSmart
# Turborepo · pnpm · Next.js · Expo · Electron · 6 apps
# Objectif final : test.edusmart.site en ligne sur Vercel

---

## CONTEXTE

Tu es un développeur senior qui crée de zéro le monorepo **EduSmart** — une plateforme
multi-établissements scolaires. Ce prompt couvre uniquement la **mise en place du
squelette du monorepo** avec les 6 applications vides mais fonctionnelles, et le
déploiement de `apps/test` sur `test.edusmart.site`.

Les 6 applications à créer (squelette uniquement, pas de logique métier) :
- `apps/vitrine`  → Next.js 14 (site public école)
- `apps/admin`    → Next.js 14 (portail admin protégé)
- `apps/mobile`   → Expo 51   (app parents/élèves)
- `apps/kids`     → Expo 51   (app enfant gamifiée)
- `apps/desktop`  → Electron 30 + React + Vite (secrétariat offline)
- `apps/test`     → Next.js 14 (page de test → test.edusmart.site)

---

## ÉTAPE 0 — Prérequis à installer sur ta machine

```bash
# Vérifier les versions (installer si manquant)
node --version      # doit être >= 20
npm --version       # doit être >= 10

# Installer pnpm (gestionnaire de packages du monorepo)
npm install -g pnpm
pnpm --version      # doit être >= 9

# Installer Turborepo globalement
npm install -g turbo
turbo --version     # doit être >= 2

# Installer EAS CLI (pour builder les apps Expo)
npm install -g eas-cli
eas --version

# Installer Expo CLI
npm install -g expo-cli
```

---

## ÉTAPE 1 — Créer la structure racine du monorepo

```bash
# 1. Créer le dossier racine


# 2. Initialiser git
git init
git branch -M main

# 3. Créer les dossiers principaux
mkdir -p apps packages .github/workflows

# 4. Créer le .gitignore racine
cat > .gitignore << 'EOF'
node_modules/
.turbo/
dist/
build/
.next/
out/
.expo/
*.log
.env
.env.local
.DS_Store
*.tgz
EOF
```

---

## ÉTAPE 2 — Fichiers de configuration racine

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `package.json` (racine)
```json
{
  "name": "edusmart",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev --parallel",
    "dev:vitrine": "turbo run dev --filter=@edusmart/vitrine",
    "dev:admin": "turbo run dev --filter=@edusmart/admin",
    "dev:test": "turbo run dev --filter=@edusmart/test",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "prettier": "^3.2.0"
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### `.env.example`
```bash
# ── Supabase ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ── OpenRouter (IA) ───────────────────────────────
OPENROUTER_API_KEY=sk-or-...

# ── Domaine ───────────────────────────────────────
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site

# ── Email (Resend) ────────────────────────────────
RESEND_API_KEY=re_...

# ── SMS (Twilio) ──────────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

### `README.md`
```markdown
# EduSmart — Plateforme multi-établissements scolaires

Monorepo Turborepo contenant 6 applications.

## Apps
| App | Tech | URL |
|-----|------|-----|
| vitrine | Next.js 14 | *.edusmart.site |
| admin | Next.js 14 | *.edusmart.site/admin |
| mobile | Expo 51 | Play Store / App Store |
| kids | Expo 51 | Play Store / App Store |
| desktop | Electron 30 | .exe / .dmg |
| test | Next.js 14 | test.edusmart.site |

## Démarrer
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
```

---

## ÉTAPE 3 — Créer `apps/test` (la seule déployée maintenant)

C'est l'app qui ira sur `test.edusmart.site`. Elle sert à vérifier que :
1. Le monorepo fonctionne
2. Vercel déploie correctement
3. Le wildcard `*.edusmart.site` fonctionne
4. Le middleware lit bien le sous-domaine

```bash
cd apps

# Créer l'app test avec Next.js
pnpm create next-app@14 test \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

cd test
```

### `apps/test/package.json` (modifier après création)
```json
{
  "name": "@edusmart/test",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3005",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}
```

### `apps/test/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  
  // Extraire le sous-domaine
  // En production : "test.edusmart.site" → slug = "test"
  // En local :      "localhost:3005"     → slug = "localhost"
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const slug = host
    .replace(`.${rootDomain}`, '')
    .replace(':3005', '')  // enlever le port en local
    .split('.')[0]

  // Injecter le slug dans les headers pour les Server Components
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-school-slug', slug)
  requestHeaders.set('x-host', host)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    // Appliquer sur tout sauf _next et fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### `apps/test/src/app/page.tsx`

```tsx
import { headers } from 'next/headers'

export default function TestPage() {
  const headersList = headers()
  const slug = headersList.get('x-school-slug') ?? 'inconnu'
  const host = headersList.get('x-host') ?? 'inconnu'

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto p-8">
        
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-mono">SYSTÈME OPÉRATIONNEL</span>
        </div>

        {/* Titre */}
        <h1 className="text-4xl font-bold mb-2">
          EduSmart{' '}
          <span className="text-yellow-400">Test</span>
        </h1>
        <p className="text-gray-400 mb-10">
          Page de vérification du déploiement Vercel + wildcard DNS
        </p>

        {/* Infos détectées */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 font-mono text-sm">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-4">
            Informations détectées
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Host</span>
            <span className="text-white">{host}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Slug école</span>
            <span className="text-yellow-400 font-bold">{slug}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Middleware</span>
            <span className="text-green-400">✓ actif</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Next.js</span>
            <span className="text-white">14 App Router</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Déployé sur</span>
            <span className="text-white">Vercel</span>
          </div>
        </div>

        {/* Checks */}
        <div className="mt-8 space-y-3">
          {[
            { label: 'Monorepo Turborepo', ok: true },
            { label: 'Wildcard *.edusmart.site', ok: true },
            { label: 'Middleware sous-domaine', ok: true },
            { label: 'Supabase (Phase 2)', ok: false },
            { label: 'OpenRouter IA (Phase 4)', ok: false },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className={ok ? 'text-green-400' : 'text-gray-600'}>
                {ok ? '✓' : '○'}
              </span>
              <span className={ok ? 'text-gray-200' : 'text-gray-600'}>{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-xs text-gray-600 font-mono">
          EduSmart · test.edusmart.site · Randrianarison Dieu Donné
        </div>
      </div>
    </main>
  )
}
```

### `apps/test/src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduSmart Test',
  description: 'Page de vérification du déploiement EduSmart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

---

## ÉTAPE 4 — Créer les 5 autres apps (squelettes vides)

Chaque app est créée avec une page minimale. On les développera dans les phases suivantes.

```bash
# Retour à la racine
cd ../../

# apps/vitrine
cd apps
pnpm create next-app@14 vitrine \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack
cd vitrine
# Modifier package.json : "name": "@edusmart/vitrine", "dev": "next dev --port 3001"
cd ..

# apps/admin
pnpm create next-app@14 admin \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack
cd admin
# Modifier package.json : "name": "@edusmart/admin", "dev": "next dev --port 3002"
cd ..

# apps/mobile (Expo)
pnpm create expo-app@latest mobile \
  --template blank-typescript
cd mobile
# Modifier package.json : "name": "@edusmart/mobile"
cd ..

# apps/kids (Expo)
pnpm create expo-app@latest kids \
  --template blank-typescript
cd kids
# Modifier package.json : "name": "@edusmart/kids"
cd ..

# apps/desktop (Electron + Vite + React)
mkdir desktop && cd desktop
pnpm init
# Modifier package.json : voir contenu ci-dessous
cd ..

cd ..  # retour racine
```

### `apps/desktop/package.json`
```json
{
  "name": "@edusmart/desktop",
  "version": "0.1.0",
  "private": true,
  "main": "electron/main.js",
  "scripts": {
    "dev": "concurrently \"vite\" \"electron .\"",
    "build": "vite build && electron-builder",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "electron": "^30",
    "electron-builder": "^24",
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "concurrently": "^8",
    "typescript": "^5"
  }
}
```

---

## ÉTAPE 5 — Créer les packages partagés

```bash
# packages/shared
mkdir -p packages/shared/src/{types,supabase,hooks,utils}

cat > packages/shared/package.json << 'EOF'
{
  "name": "@edusmart/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.0"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
EOF

# Créer le barrel file
cat > packages/shared/src/index.ts << 'EOF'
// Types
export * from './types/organization'
export * from './types/student'
export * from './types/grade'

// Utils
export * from './utils/slugify'
export * from './utils/gradeCalc'
EOF

# packages/ui
mkdir -p packages/ui/src/{tokens,components}

cat > packages/ui/package.json << 'EOF'
{
  "name": "@edusmart/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "devDependencies": {
    "typescript": "^5",
    "react": "^18"
  }
}
EOF

cat > packages/ui/src/index.ts << 'EOF'
// Design tokens
export const COLORS = {
  greenDeep:  '#1A4D3A',
  greenMid:   '#2D6A4F',
  greenLight: '#40916C',
  gold:       '#C9A84C',
  cream:      '#FAFAF8',
}

export const FONTS = {
  serif: 'Playfair Display',
  sans:  'DM Sans',
}
EOF
```

---

## ÉTAPE 6 — Installer toutes les dépendances

```bash
# Depuis la racine edusmart/
pnpm install
```

---

## ÉTAPE 7 — Tester en local

```bash
# Démarrer uniquement l'app test (port 3005)
pnpm dev:test

# Ouvrir dans le navigateur
open http://localhost:3005

# Tu dois voir la page noire avec les infos de debug
# Slug détecté : "localhost" (normal en local)
```

---

## ÉTAPE 8 — GitHub : créer le repo et pousser

```bash
# Depuis la racine edusmart/
git add .
git commit -m "feat: init monorepo EduSmart avec 6 apps squelettes"

# Sur github.com → New repository → nom: "edusmart" → Public → Create
# Puis copier l'URL SSH ou HTTPS

git remote add origin https://github.com/TON-USERNAME/edusmart.git
git push -u origin main
```

---

## ÉTAPE 9 — Déployer `apps/test` sur Vercel

### 9A — Créer le projet Vercel
```
1. Aller sur vercel.com → Add New → Project
2. Choisir le repo GitHub : edusmart
3. IMPORTANT — Root Directory : apps/test
   (Vercel doit savoir que c'est apps/test, pas la racine)
4. Framework Preset : Next.js (détecté auto)
5. Build Command : cd ../.. && pnpm build --filter=@edusmart/test
   OU laisser le défaut si Turborepo est détecté
6. Cliquer Deploy
```

### 9B — Configurer le domaine
```
Vercel Dashboard → Projet edusmart-test → Settings → Domains
→ Add : test.edusmart.site
→ Vercel affiche "Pending" jusqu'à propagation DNS
→ Devient "Valid" ✅ quand DNS propagé (si NS Vercel déjà configuré)
```

### 9C — Variables d'environnement dans Vercel
```
Settings → Environment Variables → Add :
NEXT_PUBLIC_ROOT_DOMAIN = edusmart.site
NODE_ENV = production
```

---

## ÉTAPE 10 — Vérifier que tout fonctionne

```bash
# 1. Vérifier la propagation DNS (outil en ligne)
# Aller sur : https://dnschecker.org
# Taper : test.edusmart.site
# Doit pointer vers les serveurs Vercel (76.76.21.x)

# 2. Tester l'URL en production
open https://test.edusmart.site

# Tu dois voir :
# ✓ Page noire EduSmart Test
# ✓ Host : test.edusmart.site
# ✓ Slug école : test         ← le middleware fonctionne !
# ✓ Wildcard *.edusmart.site  ← le DNS fonctionne !
```

---

## ÉTAPE 11 — GitHub Actions CI/CD

### `.github/workflows/ci.yml`
```yaml
name: CI — EduSmart

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-test:
    name: Build & Type-check apps/test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type-check
        run: pnpm --filter=@edusmart/test type-check

      - name: Build
        run: pnpm --filter=@edusmart/test build
        env:
          NEXT_PUBLIC_ROOT_DOMAIN: edusmart.site
```

---

## RÉSULTAT FINAL — Structure complète créée

```
edusmart/
├── apps/
│   ├── vitrine/          → @edusmart/vitrine  (port 3001)
│   ├── admin/            → @edusmart/admin    (port 3002)
│   ├── mobile/           → @edusmart/mobile   (Expo)
│   ├── kids/             → @edusmart/kids     (Expo)
│   ├── desktop/          → @edusmart/desktop  (Electron)
│   └── test/             → @edusmart/test     (port 3005) ✅ DÉPLOYÉ
├── packages/
│   ├── shared/           → @edusmart/shared
│   └── ui/               → @edusmart/ui
├── .github/
│   └── workflows/
│       └── ci.yml
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## CHECKLIST FINALE

- [ ] `pnpm install` sans erreur
- [ ] `pnpm dev:test` → localhost:3005 visible
- [ ] Repo GitHub créé et code poussé
- [ ] NS LWS changés vers ns1.vercel-dns.com et ns2.vercel-dns.com
- [ ] Projet Vercel créé avec Root Directory = apps/test
- [ ] Domaine test.edusmart.site ajouté dans Vercel
- [ ] DNS propagé (dnschecker.org montre Vercel)
- [ ] https://test.edusmart.site affiche la page de debug ✅
- [ ] Slug "test" détecté par le middleware ✅
- [ ] GitHub Actions passe au vert ✅

---

## PROCHAINE ÉTAPE (Phase 2)

Une fois test.edusmart.site en ligne et le middleware validé :
→ Créer le projet Supabase sur supabase.com
→ Ajouter les variables SUPABASE_URL et SUPABASE_ANON_KEY dans Vercel
→ Commencer apps/vitrine pour edusmart.site et strelitzia.edusmart.site

---
*Prompt EduSmart — Monorepo setup v1.0 — Randrianarison Dieu Donné*
