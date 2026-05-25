bash

cat > /mnt/user-data/outputs/Export_Conversation_EduSmart_V3_Final.md << 'ENDOFFILE'
# Export de Conversation — EduSmart STRELITZIA

## Métadonnées
- **Date** : 16–19 Mai 2026
- **Langue** : Français
- **Session** : EduSmart STRELITZIA — Master Informatique UAZ
- **Utilisateur** : Randrianarison Dieu Donné (Matricule 30 014 MI)
- **Email** : ddieu0970@gmail.com / randrianarison.d@zurcher.edu.mg / edusmart261@gmail.com
- **Tél** : +261 34 12 722 76
- **Université** : Université Adventiste Zurcher (UAZ)
- **Domaine actif** : edusmart.site (LWS-807771)
- **Déploiement** : edu-smart-test.vercel.app → test.edusmart.site ✅ LIVE
- **GitHub** : github.com/dieudonne261/EduSmart
- **Commit initial** : 7224512 — "chore: add Vercel config for test app"
- **Nombre d'échanges** : ~70 messages

---

# Conversation Complète

---

## Message 1 — User
Détailler ce projet : vercel, application mobile avec expo, react ou next, supabase, Openrouter, github, site vitrine, desktop app, application pour enfant

**Titre du Projet A : EduSmart STRELITZIA**
Système Intégré de Gouvernance Scolaire et d'Apprentissage Adaptatif
- Module Core (Admin & RH)
- Module Académique (Examens & Notes)
- Module IA (Suivi Adaptatif)
- Gateway & Communication

---

## Message 2 — Assistant

### Architecture EduSmart STRELITZIA

**5 Frontends :** Site vitrine (Next.js/Vercel), Admin web (Next.js), App mobile (Expo/RN), App desktop (Electron+React), App enfant (Expo gamifiée)

**4 Modules backend :** Core (Admin & RH), Académique (Examens & Notes), IA (OpenRouter: Claude/GPT-4o/Mistral), Gateway Communication (SMS/Push/Email)

**Infrastructure :** Supabase (PostgreSQL, Auth JWT, RLS, Realtime, Storage, Edge Functions) + GitHub Actions CI/CD

**5 Phases :** Core → Académique → App mobile → IA+Kids → Desktop+Vitrine

---

## Message 3 — User
Donner le détail de chaque bloc par bloc

---

## Message 4 — Assistant

### 8 Blocs détaillés

**BLOC 01 — Site vitrine** : Next.js 14, Vercel, public. Accueil, programmes, actualités, formulaire inscription → Supabase leads.

**BLOC 02 — Admin web** : Next.js 14, accès restreint. Dashboard KPI, emplois du temps, bulletins PDF, paiements. Stack: Supabase Auth, React Query, Recharts.

**BLOC 03 — App mobile** : Expo SDK 51, iOS+Android. Notes, présences, messagerie, paiement Mobile Money, bulletins PDF. Stack: Expo Router, EAS Build, MMKV.

**BLOC 04 — App desktop** : Electron 30+React+Vite. Mode offline SQLite, impression directe, sync Supabase. electron-builder.

**BLOC 05 — App enfant** : Expo+Reanimated. Avatar, mini-jeux (QCM, drag-drop, puzzle), badges, IA adaptative. Lottie, expo-av.

**BLOC 06 — Supabase Gateway** : JWT, RLS, Realtime WebSocket, Edge Functions, Storage. Rôles: super_admin/directeur/enseignant/parent/élève/enfant.

**BLOC 07 — Module IA** : OpenRouter. Analyse notes 3 semaines, score décrochage, exercices adaptatifs. Claude Haiku, Mistral 7B, Edge Functions cron.

**BLOC 08 — DevOps** : GitHub Actions CI/CD, Vercel Preview, EAS Build iOS+Android, OTA updates. Monitoring: Vercel Analytics, Sentry.

---

## Message 5 — User
Détaille la couche Frontend Web Next.js et Mobile Expo

---

## Message 6 — Assistant

### Next.js 14 App Router

```
apps/vitrine/src/app/
├── layout.tsx, page.tsx
├── about/page.tsx, programs/page.tsx
├── news/page.tsx, news/[slug]/page.tsx
├── contact/page.tsx
└── api/contact/route.ts

apps/admin/src/app/
├── middleware.ts ← JWT guard
├── (auth)/login/page.tsx
└── (dashboard)/layout.tsx
    ├── dashboard/page.tsx ← KPI
    ├── students/[id]/page.tsx
    ├── grades/bulletins/page.tsx
    ├── ai-insights/page.tsx
    └── settings/page.tsx
```

### Expo Router

```
apps/mobile/app/(tabs)/
├── index.tsx, grades/[subject].tsx
├── messages/[teacherId].tsx, profile/

apps/kids/app/
├── (auth)/code.tsx ← saisie code élève
└── (home)/map.tsx, play/[subject]/index.tsx
    trophies.tsx, me.tsx
```

**Monorepo** : Turborepo · pnpm workspaces · TypeScript strict

---

## Message 7 — User
Créer un prompt complet pour générer ce site vitrine (mock data, cmd, installation, étapes)

---

## Message 8 — Assistant

### Prompt Site Vitrine EduSmart (fichier prompt_vitrine_edusmart.md généré)

**Stack** : Next.js 14, Tailwind CSS, Shadcn/ui, Framer Motion, Mock data statique

**Couleurs** : `#1A4D3A` (vert), `#C9A84C` (or), `#FAFAF8` (crème)
**Typographie** : Playfair Display + DM Sans

```bash
npx create-next-app@14 edusmart-vitrine --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd edusmart-vitrine
npm install framer-motion lucide-react clsx tailwind-merge
npx shadcn-ui@latest init
npx shadcn-ui@latest add button badge card separator navigation-menu sheet
npm run dev
```

**tailwind.config.ts :**
```typescript
colors: {
  "green-deep": "#1A4D3A", "green-mid": "#2D6A4F",
  "green-light": "#40916C", "gold": "#C9A84C", "cream": "#FAFAF8",
}
fontFamily: { serif: ["Playfair Display"], sans: ["DM Sans"] }
```

**mock-data.ts :**
```typescript
export const SCHOOL_INFO = {
  name: "EduSmart STRELITZIA", tagline: "Excellence académique, apprentissage adaptatif",
  address: "Lot II M 85, Antananarivo 101, Madagascar",
  foundedYear: 2018,
  stats: { students: 1240, teachers: 68, successRate: 97, programs: 12 }
}
export const PROGRAMS: Program[] = [
  { id:"p1", slug:"primaire", title:"École Primaire", level:"CP→CM2", duration:"6 ans", color:"#1A4D3A" },
  { id:"p2", slug:"college", title:"Collège", level:"6ème→3ème", duration:"4 ans", color:"#C9A84C" },
  { id:"p3", slug:"lycee", title:"Lycée Général", level:"2nde→Terminale", duration:"3 ans", color:"#2D6A4F" },
  { id:"p4", slug:"langue", title:"Section Bilingue", level:"Tous niveaux", color:"#40916C" },
]
```

---

## Message 9 — User
Compléter la proposition de mémoire UAZ (document Word)

---

## Message 10 — Assistant

### Document Proposition_Memoire_EduSmart.docx généré

**Thématique** : Intelligence artificielle appliquée à la gestion scolaire et à l'apprentissage adaptatif

**Titre** : *« Conception et développement d'un système intégré de gouvernance scolaire et d'apprentissage adaptatif assisté par intelligence artificielle : plateforme EduSmart »*

**Problématique** : Gestion fragmentée (papier, Excel non partagés, zéro visibilité parents). Détection tardive des difficultés. Pas de suivi adaptatif. Contribution à la recherche sur les SIE en contexte africain.

**Objectif général** : Concevoir une plateforme web et mobile intégrée adaptable à tout établissement scolaire.

**5 Objectifs spécifiques** : Analyse besoins → Architecture modulaire → Module IA décrochage → App enfant gamifiée → Déploiement + évaluation

**Méthodologie** : Approche mixte qualitative + expérimentale + développement logiciel. Stack: Next.js, Expo, Electron, Supabase, OpenRouter, Vercel, EAS.

**Plan prévisionnel** : 5 mois (Analyse M1 → Core admin M1-2 → Académique M1-2 → IA+Mobile M2-3 → Tests+Rédaction M3)

**Résultats attendus** : 70% réduction temps bulletins · 80% détection décrochage · Prototype déployable

**Références** :
- Baker & Inventado (2014). Educational data mining. Springer.
- Romero & Ventura (2020). WIREs Data Mining.
- KECHAI H. (2018). Learning analytics. Academia.edu
- AFD (2018). Numérique et éducation en Afrique.
- UNESCO (2023). Rapport mondial éducation.
- Supabase, OpenRouter, Vercel, Expo Docs (2026).

---

## Message 11 — User
Résumé humain pour répondre aux questions lors de la présentation

---

## Message 12 — Assistant

### 8 Q&R pour la présentation

| Q | Réponse clé |
|---|---|
| C'est quoi ? | Plateforme numérique pour les écoles — remplace papier/Excel + IA décrochage |
| Quel problème ? | Gestion fragmentée : erreurs bulletins, détection tardive, zéro communication famille |
| Pourquoi l'IA ? | Analyse notes + absences → score risque 4 semaines avant examens (objectif 80%) |
| Technologies ? | Next.js, Expo, Electron, Supabase, OpenRouter — modernes, gratuites, offline OK |
| Livrables ? | Site web admin + 2 apps mobiles + app desktop + rapport mémoire |
| Durée ? | 3 mois, 5 phases chevauchantes |
| Original ? | Rien adapté à Madagascar : coût, offline, Mobile Money, SMS locaux |
| Pourquoi ce sujet ? | Je travaille à STRELITZIA SCHOOL, je vis le problème chaque jour |

---

## Message 13 — User
Format Word → document Resume_Presentation_Memoire.docx

---

## Message 14 — Assistant
Document Word généré avec 8 fiches Q&R interactives.

---

## Message 15 — User
Changer la logique : projet pour toutes les écoles (supprimer STRELITZIA)

---

## Message 16 — Assistant
**Modifications Proposition_Memoire_EduSmart.docx :**
- Titre → "plateforme EduSmart" (sans STRELITZIA)
- Objectif → "adaptable à tout établissement scolaire"
- Problématique → "déployable dans tout type d'établissement, du primaire au lycée"
- Phase 1 → "entretiens auprès d'établissements scolaires"

---

## Message 17 — User
Décrire les processus multi-écoles (École A et École B), logique, étapes, sections utilisateurs

---

## Message 18 — Assistant

### Architecture Multi-Établissements

**Principe** : `organization_id` unique par école. RLS Supabase garantit l'isolation physique.

```sql
CREATE POLICY "school_isolation" ON students
FOR ALL USING (organization_id = current_user_organization_id());
```

**5 étapes d'inscription :**
1. Formulaire edusmart.site/register
2. Validation super-admin
3. Création auto : UUID, compte directeur, email invitation
4. Configuration logo/couleurs/programmes
5. Utilisation avec filtrage SQL automatique

**École A vs École B :**

| Élément | École A | École B |
|---|---|---|
| organization_id | abc-123 | xyz-789 |
| Barème | Sur 20 | Sur 100 |
| Seuil IA | 60% | 70% |
| Accès croisé | ❌ Impossible | ❌ Impossible |

---

## Message 19 — User
Comment avoir ecole-a.edusmart.site sur Vercel ? Comment isoler les scores de jeux ?

---

## Message 20 — Assistant

### Wildcard Vercel

```typescript
// middleware.ts
const host = req.headers.get('host') ?? ''
const slug = host.replace('.edusmart.mg', '').split('.')[0]
requestHeaders.set('x-school-slug', slug)
```

**NS Vercel obligatoires :** `ns1.vercel-dns.com` + `ns2.vercel-dns.com`

### Scores isolés par organization_id + student_id

```sql
INSERT INTO game_scores (organization_id, student_id, subject, score, played_at)
VALUES ('abc-123', 'marie-001', 'mathematiques', 87, now());

-- Classement filtré école + classe
SELECT student_name, score FROM game_scores
WHERE organization_id = 'abc-123' AND class_id = '6eme-A'
ORDER BY score DESC LIMIT 10;
```

---

## Message 21 — User
Comment acheter edusmart.mg et configurer Vercel ?

---

## Message 22 — Assistant
**Registrars .mg :** Madagascar Internet (recommandé), Tranokala, Netim, Gandi
**Config Vercel :** NS → `ns1.vercel-dns.com` + `ns2.vercel-dns.com` → Settings → Domains → `edusmart.mg` + `*.edusmart.mg`
**Timeline :** achat 5' → NS 5' → propagation 48h → config Vercel 2' → code middleware 30'

---

## Message 23 — User
LWS edusmart.site offre gratuite — suffit ?

---

## Message 24 — Assistant
- **Domaine edusmart.site** ✅ Suffisant pour prototype/mémoire
- **Hébergement 1Go PHP/MySQL** ❌ Inutile (on utilise Vercel + Supabase)
- Recommandation : edusmart.site maintenant → migrer edusmart.mg pour déploiement réel

---

## Message 25 — User
Versioning GitHub CI/CD vers edusmart.site

---

## Message 26 — Assistant

### Pipeline CI/CD

**4 branches :** `feature/*` → `develop` → `staging` → `main`

**Déploiements :** feature → Preview URL · staging → staging.edusmart.site · main → *.edusmart.site

```bash
git checkout -b feature/module-ia
git add . && git commit -m "feat: ajout détection décrochage OpenRouter"
git push origin feature/module-ia
git tag v1.0.0 && git push --tags
```

```yaml
# .github/workflows/ci.yml
name: CI — EduSmart
on:
  push: { branches: [main, staging, develop] }
  pull_request: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci && npm run lint && npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

---

## Message 27-28 — Architecture complète monorepo

```
edusmart/
├── apps/
│   ├── vitrine/    → @edusmart/vitrine  (port 3001) Next.js 14
│   ├── admin/      → @edusmart/admin    (port 3002) Next.js 14
│   ├── mobile/     → @edusmart/mobile   Expo SDK 51
│   ├── kids/       → @edusmart/kids     Expo SDK 51
│   ├── desktop/    → @edusmart/desktop  Electron 30
│   └── test/       → @edusmart/test     (port 3005) Next.js 14 ✅ LIVE
├── packages/
│   ├── shared/     → types, hooks, Supabase client, utils
│   └── ui/         → design system, tokens CSS
├── turbo.json, pnpm-workspace.yaml
├── package.json, .env.example, .github/workflows/
└── README.md
```

**URLs finales :**

| App | Tech | URL |
|---|---|---|
| vitrine | Next.js 14 | *.edusmart.site |
| admin | Next.js 14 | *.edusmart.site/admin |
| mobile | Expo RN | App Store / Play Store |
| kids | Expo RN | App Store / Play Store |
| desktop | Electron | .exe / .dmg |
| test | Next.js 14 | test.edusmart.site ✅ |

---

## Message 29-30 — Architecture fichiers complète

### apps/vitrine
```
src/app/
├── layout.tsx, page.tsx
├── about/page.tsx, programs/page.tsx
├── news/page.tsx, news/[slug]/page.tsx (generateStaticParams)
├── contact/page.tsx → formulaire famille
└── api/contact/route.ts → Supabase leads
middleware.ts → lit sous-domaine → identifie école
```

### apps/admin
```
src/app/
├── (auth)/login/page.tsx, reset-password/page.tsx
└── (dashboard)/layout.tsx → Sidebar + vérif session
    ├── dashboard/page.tsx ← KPI globaux
    ├── students/page.tsx, students/new/, students/[id]/
    ├── grades/page.tsx, grades/bulletins/page.tsx
    ├── staff/[id]/page.tsx, schedule/page.tsx
    ├── finance/page.tsx, ai-insights/page.tsx
    └── settings/vitrine/page.tsx ← modifier logo/couleurs
api/grades/route.ts, api/pdf/route.ts, api/ai/route.ts
```

### apps/mobile
```
app/(auth)/login.tsx, onboarding.tsx
app/(tabs)/_layout.tsx ← 4 onglets bottom
    index.tsx, grades/index.tsx, grades/[subject].tsx
    grades/bulletin.tsx, attendance/index.tsx
    messages/index.tsx, messages/[teacherId].tsx
    profile/index.tsx
hooks/useStudent.ts, useRealtime.ts
app.json, eas.json
```

### apps/kids
```
app/(auth)/code.tsx ← saisie code + QR
app/(home)/map.tsx
app/(home)/play/[subject]/index.tsx ← mini-jeu adaptatif
app/(home)/play/result.tsx
app/(home)/trophies.tsx, me.tsx
components/QCMGame.tsx, DragDropGame.tsx, AvatarBuilder.tsx, StarReward.tsx
assets/lottie/, sounds/
```

### apps/desktop
```
electron/main.ts, preload.ts, db.ts (SQLite), sync.ts, print.ts
src/pages/Dashboard.tsx, Students.tsx, GradeEntry.tsx (tableau Excel)
    Bulletins.tsx, Certificates.tsx, Sync.tsx
electron-builder.yml
```

### packages/shared
```
src/types/organization.ts, student.ts, grade.ts, staff.ts, ai.ts
src/supabase/client.ts ← createClient() browser
src/supabase/server.ts ← createServerSupabase() Server Components
src/supabase/database.types.ts ← auto-généré CLI Supabase
src/utils/gradeCalc.ts, slugify.ts, riskScore.ts
src/hooks/useOrg.ts, useSession.ts, useStudent.ts
```

---

## Message 31-32 — URLs réelles et logique login

### URLs EduSmart

```
edusmart.site              → landing marketing (directeurs)
edusmart.site/register     → inscription nouvelle école
edusmart.site/admin        → super-admin (Randrianarison D.D.)
test.edusmart.site         → ✅ LIVE — page de debug
strelitzia.edusmart.site   → vitrine STRELITZIA SCHOOL
strelitzia.edusmart.site/login     → connexion unique tous rôles
strelitzia.edusmart.site/admin     → admin STRELITZIA
strelitzia.edusmart.site/dashboard → parents & élèves
uaz.edusmart.site          → vitrine UAZ
uaz.edusmart.site/admin    → admin UAZ
```

### Middleware multi-tenant complet

```typescript
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const headers = new Headers(req.headers)

  if (host.includes('localhost')) {
    const school = req.nextUrl.searchParams.get('school') ?? '__root__'
    headers.set('x-school-slug', school)
    return NextResponse.next({ request: { headers } })
  }
  if (host === rootDomain || host === `www.${rootDomain}`) {
    headers.set('x-school-slug', '__root__')
    return NextResponse.next({ request: { headers } })
  }
  const slug = host.replace(`.${rootDomain}`, '')
  headers.set('x-school-slug', slug)
  return NextResponse.next({ request: { headers } })
}
```

### Login → redirection par rôle

```typescript
// Server Action — actions.ts
export async function loginAction(formData: FormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: 'Email ou mot de passe incorrect' }

  const role  = data.user.user_metadata.role
  const orgId = data.user.user_metadata.organization_id
  const currOrg = headers().get('x-org-id')
  if (orgId !== currOrg) return { error: 'Ce compte appartient à une autre école' }

  const redirectMap = {
    director: '/admin/dashboard', teacher: '/admin/grades',
    secretary: '/admin/students', parent: '/dashboard',
    student: '/dashboard/student',
  }
  redirect(redirectMap[role] ?? '/')
}
```

### 6 rôles

| Rôle | Accès |
|---|---|
| super_admin | edusmart.site/admin — toutes écoles |
| director | Tout /admin de son école |
| teacher | /admin/grades, /admin/quiz — SES classes |
| secretary | /admin/students, bulletins |
| parent | /dashboard — SES enfants |
| student/kid | /dashboard — son profil |

### App kids — 3 modes connexion

```json
// QR Code
{ "student_code": "STR-2025-042", "org_id": "str-uuid-xxx", "expires_at": "2026-08-31" }
```
- Option 1 : QR Code (recommandé — scan → connecté instantanément)
- Option 2 : Google OAuth
- Option 3 : Code court "STR-2025-042" + PIN 4 chiffres

### App desktop — sync offline

```
● Connecté  → sync auto toutes 5 min
● Hors-ligne → SQLite local, 0 perte de données
● Conflit    → last-write-wins (comparer updated_at)
```

---

## Message 33 — User
Email reçu : "edusmart.site est prêt — LWS-807771" (16/05/2026)

---

## Message 34-36 — Configuration DNS LWS complète

### DNS Records LWS Zone DNS

```
Type   Nom                  Valeur                                       TTL
────────────────────────────────────────────────────────────────────────────
A      @                    76.76.21.21                                  30min
A      mail                 213.255.195.65                               30min
CNAME  test                 7c280f9aadf5f882.vercel-dns-017.com.         30min
CNAME  *                    7c280f9aadf5f882.vercel-dns-017.com.         30min
MX     @                    mail.edusmart.site. (priorité 10)            30min
TXT    _vercel              vc-domain-verify=XXXXX                       30min
TXT    resend._domainkey    p=MII...                                     30min
TXT    _dmarc               v=DMARC1; p=none; rua=mailto:admin@edusmart.site
TXT    @                    v=spf1 include:mail.lws.fr include:_spf.google.com ~all
```

---

## Message 37-38 — Guide complet 4 phases test.edusmart.site

### Phase 1 — LWS DNS (5 min)
Ajouter A @, CNAME test, CNAME *, TXT _vercel, TTL 30min

### Phase 2 — GitHub + Code (10 min)
```bash
mkdir edusmart && cd edusmart
git init && git branch -M main
mkdir -p apps packages .github/workflows

# pnpm-workspace.yaml
packages: ["apps/*", "packages/*"]

# package.json
{ "name": "edusmart", "scripts": { "dev:test": "turbo run dev --filter=@edusmart/test" } }

cd apps
pnpm create next-app@14 test --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

**middleware.ts :**
```typescript
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const slug = host.includes('localhost')
    ? req.nextUrl.searchParams.get('school') ?? '__root__'
    : host.replace(`.${rootDomain}`, '').split(':')[0]
  const headers = new Headers(req.headers)
  headers.set('x-school-slug', slug)
  return NextResponse.next({ request: { headers } })
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

**page.tsx debug :**
```tsx
export default function TestPage() {
  const slug = headers().get('x-school-slug') ?? 'inconnu'
  const host = headers().get('host') ?? 'inconnu'
  return (
    <main className="min-h-screen bg-gray-950 text-white p-12">
      <div className="text-green-400">● SYSTÈME OPÉRATIONNEL</div>
      <h1>EduSmart <span className="text-yellow-400">Test</span></h1>
      <p>Host : {host} | Slug : <strong>{slug}</strong></p>
      <p className="text-green-400">✓ Middleware actif · ✓ Wildcard DNS OK</p>
    </main>
  )
}
```

```bash
pnpm install && pnpm dev:test # → localhost:3005
git add . && git commit -m "feat: init monorepo + apps/test"
git remote add origin https://github.com/dieudonne261/EduSmart.git
git push -u origin main
```

### Phase 3 — Vercel (10 min)
```
Root Directory : apps/test
Framework      : Next.js
Build Command  : cd ../.. && pnpm install && pnpm --filter=@edusmart/test build
```
→ Settings → Domains → test.edusmart.site → copier TXT _vercel

### Phase 4 — Vérification
```bash
nslookup test.edusmart.site
# → 7c280f9aadf5f882.vercel-dns-017.com ✅
open https://test.edusmart.site
# Host: test.edusmart.site | Slug: test | Middleware: actif ✅
```

---

## Message 39-42 — Vercel déployé + domaine

**Vercel deployment :** edu-smart-test.vercel.app — Status: Ready ✅

**Nouveau CNAME Vercel :** `7c280f9aadf5f882.vercel-dns-017.com.` (remplace l'ancien cname.vercel-dns.com)

---

## Message 43-44 — Variables d'environnement toutes apps

```dotenv
# Supabase (supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Domaine
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site

# OpenRouter (openrouter.ai → Keys)
OPENROUTER_API_KEY=sk-or-...

# Email Resend (resend.com → API Keys)
RESEND_API_KEY=re_...

# SMS (Twilio ou Africa's Talking)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

**Ordre de priorité :**
1. MAINTENANT : Supabase (Singapore) + ROOT_DOMAIN
2. Phase 2 : LWS Mail inclus + Resend (Ireland eu-west-1)
3. Phase 3 : OpenRouter (Claude Haiku / Mistral 7B)
4. Phase 4 : Twilio / Africa's Talking (SMS Madagascar)

**LWS Mail — créer dans panel.lws.fr :**
```
contact@edusmart.site  ← pour les familles
admin@edusmart.site    ← pour toi
IMAP : mail.edusmart.site Port 993 SSL
SMTP : mail.edusmart.site Port 465 SSL
```

---

## Message 45-46 — Erreur Outlook IMAP + Fix

**Cause :** CNAME `*` interceptait `mail.edusmart.site` → redirigé vers Vercel

**Fix :** Ajouter dans LWS Zone DNS :
```
A   mail  213.255.195.65     ← IP MAIL LWS
MX  @     mail.edusmart.site. (priorité 10)
```

---

## Message 47-48 — Resend configuration

```
Name   : edusmart.site
Region : Ireland (eu-west-1)  ← plus proche Madagascar
DNS à ajouter dans LWS :
  TXT  resend._domainkey.edusmart.site → p=MII...
  MX   send.edusmart.site              → feedback-smtp.eu-west-1.amazonses.com.
  TXT  send.edusmart.site              → v=spf1 include:amazonses.com ~all
```

---

## Message 49-50 — Création automatique école + Vitrine dynamique

### Logique création automatique après approbation

```typescript
// Edge Function on_school_approved.ts
await supabase.from('organizations').insert({
  slug, name, status: 'active', colors: { primary: "#1A4D3A" }
})
await supabase.auth.admin.createUser({
  email: directorEmail,
  user_metadata: { role: 'director', organization_id: newOrgId }
})
await resend.emails.send({
  to: directorEmail,
  subject: `Votre espace ${name} est prêt !`,
  html: `Connectez-vous sur ${slug}.edusmart.site/login`
})
await supabase.from('vitrine_settings').insert({
  org_id: newOrgId, tagline: "Bienvenue", sections_visible: ["hero","stats","programs","news"]
})
```

### Tables Supabase — stockage vitrine

| Table | Contenu |
|---|---|
| organizations | slug, nom, logo_url, colors JSON, adresse |
| vitrine_settings | tagline, banner, sections visibles, SEO |
| programs | filières par org_id |
| news_articles | actualités par org_id (published=true) |
| team_members | équipe par org_id |

### Supabase Storage
```
vitrine/
├── uaz/logo.png, banner.jpg
└── strelitzia/logo.png, banner.jpg
URL : https://xxx.supabase.co/storage/v1/object/public/vitrine/[slug]/logo.png
```

### Mise à jour vitrine par l'admin

```typescript
// Server Action — mise à jour instantanée
await supabase.storage.from('vitrine').upload(`${org_id}/logo.png`, logo, { upsert: true })
await supabase.from('organizations').update({ name, tagline, colors }).eq('id', org_id)
revalidatePath('/') // → vitrine mise à jour en quelques secondes
```

---

## Message 51-52 — edusmart.site vs strelitzia.edusmart.site

### Différence fondamentale

| Site | Public cible | CTA |
|---|---|---|
| edusmart.site | Directeurs d'école | "Inscrire mon école" |
| strelitzia.edusmart.site | Familles, parents | "Inscrire mon enfant" |

### Structure code — un seul déploiement

```
apps/vitrine/src/app/page.tsx
→ if (slug === '__root__') return <RootHomePage />  // edusmart.site marketing
→ return <SchoolHomePage slug={slug} />              // vitrine école

apps/vitrine/src/app/(root)/  ← site marketing EduSmart
├── layout.tsx (Nav marketing)
├── page.tsx (Hero + Features + Comment ça marche + Tarifs + CTA)
├── features/, pricing/, register/, demo/, login/

apps/vitrine/src/app/(school)/  ← vitrines écoles
├── layout.tsx (charge données Supabase par slug)
├── page.tsx, about/, programs/, news/[slug]/, contact/
```

### Pages edusmart.site

```
/           → Landing marketing (Features, témoignages directeurs, tarifs)
/features   → Fonctionnalités détaillées
/pricing    → Plans (Gratuit <100 élèves / Starter / Pro)
/register   → Formulaire inscription école
/admin      → Dashboard super-admin (toi seul)
/demo       → Visite guidée interactive
```

---

## Message 53-54 — Login complet chaque app

### Stockage sessions par app

| App | Stockage | Durée |
|---|---|---|
| Web Next.js | Cookie httpOnly | 1h + refresh |
| App mobile | iOS Keychain / Android Keystore | Jusqu'à déco |
| App kids | MMKV local chiffré | Toute l'année |
| Desktop | electron-store chiffré | Permanent |

### Route /auth/callback (OBLIGATOIRE pour OAuth + Magic Link)

```typescript
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code   = searchParams.get('code')
  const school = searchParams.get('school') ?? '__root__'

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Google → créer profil si nouveau
      const profile = await getProfile(data.user.id)
      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id, organization_id: orgId,
          role: 'parent', full_name: data.user.user_metadata.full_name
        })
      }
      const dest = school !== '__root__'
        ? `https://${school}.edusmart.site/dashboard`
        : `https://edusmart.site/admin`
      return NextResponse.redirect(dest)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
```

---

## Message 55-56 — Roadmap développement séquentiel

### Phase 0 — .env (20 min)
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
```
✅ Test : afficher "Supabase : ✅ connecté" dans page.tsx

### Phase 1 — Tables Supabase

```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  tagline TEXT, logo_url TEXT,
  colors JSONB DEFAULT '{"primary":"#1A4D3A"}',
  address TEXT, phone TEXT, email TEXT, city TEXT,
  status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL, full_name TEXT
);
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title TEXT, level TEXT, description TEXT, color TEXT
);
CREATE TABLE news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title TEXT, excerpt TEXT, content TEXT, published BOOLEAN DEFAULT false
);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_orgs" ON organizations FOR SELECT USING (true);
CREATE POLICY "public_read_programs" ON programs FOR SELECT USING (true);
CREATE POLICY "public_read_news" ON news_articles FOR SELECT USING (published = true);
CREATE POLICY "own_profile" ON profiles FOR ALL USING (id = auth.uid());

-- Données test
INSERT INTO organizations (slug,name,tagline,colors,city) VALUES
('strelitzia','STRELITZIA SCHOOL','Excellence à Toamasina','{"primary":"#1A4D3A","secondary":"#C9A84C"}','Toamasina'),
('uaz','Université Adventiste Zurcher','Excellence chrétienne','{"primary":"#534AB7","secondary":"#C9A84C"}','Antananarivo');
```

### Phase 2 — packages/shared

```typescript
// supabase/client.ts (browser)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
// supabase/server.ts
export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(URL, KEY, {
    cookies: { getAll: () => cookieStore.getAll() }
  })
}
// types/organization.ts
export type Organization = {
  id: string; slug: string; name: string; tagline: string | null;
  logo_url: string | null; colors: { primary: string; secondary?: string };
  address: string | null; city: string | null; status: 'active' | 'suspended'
}
```

### Phases 3-5 : Middleware → Vitrine → Login

**✅ Test local :** `localhost:3001?school=strelitzia` → données STRELITZIA en vert
**✅ Test local :** `localhost:3001?school=uaz` → données UAZ en violet
**✅ Test production :** strelitzia.edusmart.site fonctionne

**Règle d'or :** Code → Test local → Debug → OK → Push → Vercel déploie → Test production → OK → Phase suivante

---

## Message 57-58 — Assistant IA dans les vitrines

### 3 niveaux d'IA selon l'utilisateur
- **Anonyme** : chat basique, historique localStorage
- **Parent/Élève** : chat personnalisé, historique Supabase
- **Admin/Enseignant** : génération leçons, quiz, bulletins, analyses

### Route API Chat streaming

```typescript
// apps/vitrine/src/app/api/chat/route.ts
export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const slug = headers().get('x-school-slug')
  const school = await getSchoolBySlug(slug)

  const systemPrompt = `Tu es l'assistant de ${school.name}, école à ${school.city}.
Tu aides les visiteurs. Réponds en français, sois bienveillant et concis.`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      stream: true, max_tokens: 300,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
  })
  return new Response(response.body, { headers: { 'Content-Type': 'text/event-stream' } })
}
```

### ChatWidget localStorage si anonyme

```typescript
'use client'
const STORAGE_KEY = 'edusmart_chat_history'

export function ChatWidget({ school, user }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (user) loadFromSupabase(user.id).then(setMessages)
    else {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setMessages(JSON.parse(saved))
    }
  }, [user])

  async function sendMessage() {
    // fetch('/api/chat') avec streaming ReadableStream
    if (user) saveToSupabase(user.id, finalMessages)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(finalMessages))
  }

  return (
    <>
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-primary)]">💬</button>
      {open && <ChatWindow messages={messages} onSend={sendMessage} />}
    </>
  )
}
```

### Outils IA admin — 6 fonctionnalités

| Outil | Modèle | Usage |
|---|---|---|
| Génération leçons | claude-3-haiku | Plan cours complet |
| Génération quiz JSON | mistral-7b | QCM publiés dans app kids |
| Appréciations bulletins | claude-3-haiku | 3 versions par élève |
| Analyse classe | claude-3-5-sonnet | Lacunes communes |
| Communications parents | mistral-7b | Lettres, convocations |
| Détection décrochage | claude-3-haiku | Cron hebdomadaire |

```typescript
// JSON structuré — quiz garanti
body: JSON.stringify({
  model: 'mistralai/mistral-7b-instruct',
  max_tokens: 2000,
  response_format: { type: 'json_object' },
  messages: [{ role: 'user', content: `Génère 5 QCM JSON: {"questions":[...]}` }]
})

// Fallback modèle
models: ['anthropic/claude-3-haiku', 'mistralai/mistral-7b-instruct'],
route: 'fallback',
```

---

## Message 59-60 — Vibe Coding Guide (fichier .md généré)

### Fichier EduSmart_VibeCoding_Guide.md

**Prérequis :**
```bash
node --version # >= 20
npm install -g pnpm turbo eas-cli expo-cli
npm install -g @anthropic-ai/claude-code
claude login
```

**Fichier CLAUDE.md racine :**
```markdown
# EduSmart — Contexte pour Claude Code
Stack: Next.js 14, Expo 51, Electron 30, Supabase, OpenRouter, Turborepo
Règles: TypeScript strict · filtrer par organization_id · jamais clés API en code
Test local: localhost:3001?school=strelitzia
```

### 35 tâches ordonnées (5 semaines)

Semaine 1 : .env → Tables SQL → packages/shared → Middleware → Test
Semaine 2 : apps/vitrine → layout → accueil → pages → ChatWidget → /api/chat
Semaine 3 : apps/admin → login → dashboard → élèves → notes → settings vitrine
Semaine 4 : Module IA → app mobile → notifications push
Semaine 5 : App kids → App desktop → offline sync

---

## Message 61-62 — Supabase Auth complet

### URL Configuration (OBLIGATOIRE)
```
Site URL        : https://edusmart.site
Redirect URLs   : https://*.edusmart.site/**
                  http://localhost:3001/**
                  http://localhost:3002/**
                  exp://localhost:8081/--/**
```

### SMTP Resend dans Supabase
```
Host     : smtp.resend.com
Port     : 465
Username : resend
Password : re_XXXXXXXXXXXX (clé API Resend)
From     : noreply@edusmart.site
```

### Magic Link

```typescript
// sendMagicLink Server Action
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `https://${slug}.edusmart.site/auth/callback`,
    shouldCreateUser: false, // compte doit déjà exister
  }
})
```

### Google OAuth

**Config Google Cloud Console :**
```
App name               : EduSmart
Authorized JS origins  : https://edusmart.site (UN SEUL — pas les sous-domaines)
                         http://localhost:3001
Redirect URI           : https://[ref].supabase.co/auth/v1/callback
```

**Astuce slug central :**
```typescript
// OAuth part de edusmart.site, pas du sous-domaine
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `https://edusmart.site/auth/callback?school=${slug}`,
  }
})
// → 1 seul credential Google pour TOUTES les écoles
```

**Changer "supabase.co" → "EduSmart" dans popup Google :**
- Google Console → OAuth consent screen → Publish App (passer de Testing → Production)
- Remplir : App name, logo, domaine autorisé edusmart.site

---

## Message 63-65 — Templates email Supabase (5 fichiers .html générés)

### 5 templates créés
1. `1_confirm_signup.html` — Confirmation d'inscription (barre verte, icône maison)
2. `2_magic_link.html` — Lien magique (barre dorée, icône lien)
3. `3_reset_password.html` — Réinitialisation mot de passe (barre rouge)
4. `4_email_change.html` — Changement d'adresse email
5. `5_welcome.html` — Email de bienvenue après confirmation

**Design** : Flat (sans gradients), border-radius modéré (4-6px), style Linear/Vercel.

**Variables Supabase utilisées :**
- `{{ .ConfirmationURL }}` → lien unique
- `{{ .Token }}` → OTP 6 chiffres
- `{{ .Email }}` → adresse email
- `{{ .NewEmail }}` → nouvelle adresse (email change)

---

## Message 66-67 — Google Console problèmes + Avatar email

### Problèmes Google Console

**Cause :** edusmart.site est une page vide (domaine juste acheté chez LWS, pas encore de contenu).

**Solution :** rester en **Testing** pour l'instant :
```
Google Cloud Console → OAuth consent screen
→ Publishing status : Testing
→ Test users → ajouter :
  ddieu0970@gmail.com
  edusmart261@gmail.com
  randrianarison.d@zurcher.edu.mg
```
La validation Google n'est nécessaire qu'en production réelle.

### 5 méthodes avatar email

**1. Gravatar (universel) :**
- gravatar.com → Create account → Add email address → contact@edusmart.site → Upload photo
- Fonctionne dans Gmail, Outlook, Apple Mail, Slack, GitHub

**2. Webmail LWS RoundCube :**
- mail.edusmart.site → Paramètres ⚙️ → Identités → Modifier nom complet + organisation + signature
- Visible seulement dans l'interface webmail

**3. Google Account alias :**
- Gmail → Paramètres → Comptes → Envoyer en tant que → Ajouter contact@edusmart.site
- Config SMTP LWS : mail.edusmart.site, Port 465, SSL
- Ta photo Google s'affiche chez les destinataires Gmail

**4. SPF / DKIM / DMARC (délivrabilité) :**
```
TXT  @              v=spf1 include:mail.lws.fr include:_spf.google.com ~all
TXT  mail._domainkey v=DKIM1; k=rsa; p=... (généré par LWS Panel)
TXT  _dmarc          v=DMARC1; p=none; rua=mailto:admin@edusmart.site
```
→ Vérifier sur mail-tester.com → objectif 9-10/10

**5. Signature HTML avec photo :**
```html
<table>
  <tr>
    <td><img src="https://xxx.supabase.co/storage/.../dieudonne.jpg" width="52" height="52" style="border-radius:50%;border:2px solid #1A4D3A;"></td>
    <td style="border-left:2px solid #C9A84C;padding-left:14px;">
      <div style="font-weight:700;color:#1A4D3A;">Dieu Donné RANDRIANARISON</div>
      <div style="color:#555;font-size:12px;">Fondateur · EduSmart</div>
      <a href="mailto:contact@edusmart.site">contact@edusmart.site</a>
    </td>
  </tr>
</table>
```

**Ordre recommandé :** SPF+DKIM+DMARC → Gravatar → Alias Gmail → Signature HTML

---

# Annexes

## Fichiers générés

| Fichier | Type | Description |
|---|---|---|
| Proposition_Memoire_EduSmart.docx | Word | Proposition mémoire complète UAZ |
| Resume_Presentation_Memoire.docx | Word | Fiches Q&R présentation |
| EduSmart_Architecture_Multi_Ecoles.docx | Word | Architecture multi-établissements |
| prompt_vitrine_edusmart.md | Markdown | Prompt complet site vitrine Next.js |
| prompt_monorepo_edusmart.md | Markdown | Prompt monorepo 6 apps |
| EduSmart_VibeCoding_Guide.md | Markdown | Guide Claude Code vibe coding |
| Export_Conversation_EduSmart.md | Markdown | Export V1 |
| Export_Conversation_EduSmart_V2.md | Markdown | Export V2 |
| Export_Conversation_EduSmart_V3_Final.md | Markdown | Ce fichier |
| email-templates/1_confirm_signup.html | HTML | Template email confirmation |
| email-templates/2_magic_link.html | HTML | Template magic link |
| email-templates/3_reset_password.html | HTML | Template reset password |

## Stack technologique complète

```
Frontend Web    : Next.js 14 App Router (TypeScript strict)
Mobile          : Expo SDK 51 React Native (EAS Build)
Desktop         : Electron 30 + React + Vite
Backend/DB      : Supabase (PostgreSQL, Auth JWT, RLS, Realtime, Storage, Edge Functions)
IA Chat         : OpenRouter → mistral-7b-instruct (streaming, max_tokens 300)
IA Admin        : OpenRouter → claude-3-haiku / claude-3-5-sonnet / mistral-7b
Email auto      : Resend (3000/mois gratuit, smtp.resend.com port 465, region eu-west-1)
Email manuel    : LWS Mail (mail.edusmart.site, IMAP 993 / SMTP 465 SSL)
SMS             : Twilio / Africa's Talking (mieux pour Madagascar)
Monorepo        : Turborepo 2.x + pnpm 9.x workspaces
CI/CD           : GitHub Actions + Vercel Deploy + Expo EAS
Hébergement     : Vercel (wildcard *.edusmart.site)
DNS             : LWS nameservers (ns21-ns24.lwsdns.com) + Zone DNS manuelle
Domaine         : edusmart.site (LWS-807771, 16/05/2026)
Auth            : Supabase Auth (Email+Mdp, Magic Link, Google OAuth)
Avatar email    : Gravatar (contact@edusmart.site) + SPF/DKIM/DMARC
Design          : Tailwind CSS + Shadcn/ui
Typographie     : Playfair Display (titres) + DM Sans (corps)
Couleurs        : Vert #1A4D3A + Or #C9A84C + Crème #FAFAF8
IA locale       : riskScore.ts (algorithme décrochage sans API)
```

## Toutes les URLs et références

```
test.edusmart.site         → https://test.edusmart.site (LIVE ✅)
Vercel projet              → https://vercel.com/dieudonne261s-projects/edu-smart-test
GitHub EduSmart            → https://github.com/dieudonne261/EduSmart
LWS Panel                  → https://panel.lws.fr (LWS-807771)
Supabase Dashboard         → https://supabase.com/dashboard
OpenRouter                 → https://openrouter.ai
Resend                     → https://resend.com
Gravatar                   → https://gravatar.com
Google Cloud Console       → https://console.cloud.google.com
mail-tester.com            → https://mail-tester.com
dnschecker.org             → https://dnschecker.org
Next.js 14 docs            → https://nextjs.org/docs/app
Supabase JS                → https://supabase.com/docs/reference/javascript
Expo Router                → https://docs.expo.dev/router/introduction
Turborepo                  → https://turbo.build/repo/docs
Shadcn/ui                  → https://ui.shadcn.com
Claude Code docs           → https://docs.anthropic.com/claude-code
OpenRouter docs            → https://openrouter.ai/docs
Vercel docs                → https://vercel.com/docs
EAS Build                  → https://docs.expo.dev/build/introduction
```

## Informations personnelles projet

```
Étudiant       : Randrianarison Dieu Donné
Matricule      : 30 014 MI
Université     : Université Adventiste Zurcher (UAZ)
Programme      : Master Informatique — Sciences de l'ingénieur
Email perso    : ddieu0970@gmail.com
Email étudiant : randrianarison.d@zurcher.edu.mg
Email EduSmart : edusmart261@gmail.com
Téléphone      : +261 34 12 722 76
École terrain  : STRELITZIA SCHOOL, Toamasina, Madagascar
Domaine LWS    : edusmart.site (LWS-807771, validé 16/05/2026)
GitHub user    : dieudonne261
Vercel user    : dieudonne261s-projects
Supabase       : région Singapore (à créer)
test.edusmart.site : LIVE depuis le 17/05/2026
```

---
*Export V3 Final — EduSmart STRELITZIA — Master Informatique UAZ — 19 Mai 2026*
*Randrianarison Dieu Donné — ddieu0970@gmail.com*
ENDOFFILE
echo "✅ Export V3 Final généré — $(wc -l < /mnt/user-data/outputs/Export_Conversation_EduSmart_V3_Final.md) lignes"
Sortie