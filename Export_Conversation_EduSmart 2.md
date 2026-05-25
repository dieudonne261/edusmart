bash

cat > /mnt/user-data/outputs/Export_Conversation_EduSmart_V2.md << 'ENDOFFILE'
# Export de Conversation — EduSmart STRELITZIA

## Métadonnées
- **Date** : 17-19 Mai 2026
- **Langue** : Français
- **Utilisateur** : Randrianarison Dieu Donné
- **Matricule UAZ** : 30 014 MI
- **Email** : ddieu0970@gmail.com / randrianarison.d@zurcher.edu.mg
- **Tél** : +261 34 12 722 76
- **Université** : Université Adventiste Zurcher (UAZ)
- **Programme** : Master Informatique
- **Domaine acquis** : edusmart.site (LWS-807771)
- **Déploiement actif** : edu-smart-test.vercel.app → test.edusmart.site
- **GitHub** : github.com/dieudonne261/EduSmart
- **Nombre de messages** : ~60 échanges

---

# Conversation Complète

---

## Message 1 — User
Détailler ce projet : vercel, application mobile avec expo, react ou next, supabase, Openrouter, github, site vitrine, desktop app, application pour enfant

**Titre du Projet : EduSmart STRELITZIA**
Système Intégré de Gouvernance Scolaire et d'Apprentissage Adaptatif

Architecture :
- Module Core (Admin & RH)
- Module Académique (Examens & Notes)
- Module IA (Suivi Adaptatif)
- Gateway & Communication

---

## Message 2 — Assistant

### Architecture EduSmart STRELITZIA

**5 Frontends :**
- Site vitrine — Next.js / Vercel
- Admin web — Next.js, accès restreint
- App mobile — Expo / React Native
- App desktop — Electron + React
- App enfant — Expo, gamifiée

**4 Modules backend :**
- Module Core (Admin & RH)
- Module Académique (Examens & Notes)
- Module IA — OpenRouter (Claude, GPT-4o, Mistral)
- Gateway Communication — SMS, Push, Email

**Infrastructure :** Supabase (PostgreSQL + Auth JWT + RLS + Realtime + Storage + Edge Functions) + GitHub Actions CI/CD

**5 Phases de construction :**
1. Supabase + Auth + Module Core
2. Module Académique + app admin + génération bulletins
3. App mobile + notifications push
4. Module IA + OpenRouter + app enfant
5. App desktop + site vitrine + déploiement production

---

## Message 3 — User
Donner le détail de chaque bloc par bloc

---

## Message 4 — Assistant

### 8 Blocs détaillés

**BLOC 01 — Site vitrine** (Next.js 14, Vercel, public)
- Page d'accueil publique, formulaire inscription, actualités, SEO
- Stack: Next.js 14, Tailwind, Vercel, GitHub, Supabase

**BLOC 02 — Admin web** (Next.js 14, accès restreint)
- Dashboard KPI, emplois du temps, bulletins PDF, paiements
- Stack: Next.js 14, Supabase Auth, React Query, Recharts

**BLOC 03 — App mobile** (Expo SDK 51)
- Notes, présences, messagerie, paiement Mobile Money, bulletins PDF
- Stack: Expo Router, Supabase JS, Expo Notifs, EAS Build, MMKV

**BLOC 04 — App desktop** (Electron, offline)
- Mode hors-ligne SQLite, impression directe, sync Supabase
- Stack: Electron 30, React + Vite, SQLite, electron-builder

**BLOC 05 — App enfant** (Expo, 6-14 ans)
- Avatar, mini-jeux (QCM, drag-drop, puzzle), badges, IA adaptative
- Stack: Expo + Reanimated, Lottie, Supabase, OpenRouter, expo-av

**BLOC 06 — Supabase Gateway**
- JWT, Row-Level Security, Realtime WebSocket, Edge Functions, Storage
- Rôles: super_admin, directeur, enseignant, parent, élève, enfant

**BLOC 07 — Module IA** (OpenRouter)
- Analyse notes 3 semaines, score risque décrochage, exercices adaptatifs
- Stack: OpenRouter, Claude Haiku, Mistral 7B, Edge Functions cron

**BLOC 08 — DevOps** (GitHub, Vercel, EAS)
- CI/CD automatique, tests Jest, Vercel Preview, EAS Build iOS/Android
- Monitoring: Vercel Analytics, Sentry, Supabase logs

---

## Message 5 — User
Détaille la couche Frontend Web Next.js et Mobile Expo

---

## Message 6 — Assistant

### Next.js App Router — Structure

```
apps/vitrine/src/app/
├── layout.tsx          ← Nav · Footer · Fonts
├── page.tsx            ← Accueil
├── about/page.tsx
├── programs/page.tsx
├── news/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── contact/page.tsx
└── api/contact/route.ts

apps/admin/src/app/
├── middleware.ts           ← JWT guard
├── (auth)/login/page.tsx
└── (dashboard)/
    ├── layout.tsx
    ├── dashboard/page.tsx
    ├── students/[id]/page.tsx
    ├── grades/bulletins/page.tsx
    ├── staff/[id]/page.tsx
    ├── ai-insights/page.tsx
    └── settings/page.tsx
```

### Expo Router — Apps mobiles

```
apps/mobile/app/
├── (auth)/login.tsx
└── (tabs)/
    ├── index.tsx
    ├── grades/[subject].tsx
    ├── messages/[teacherId].tsx
    └── profile/index.tsx

apps/kids/app/
├── (auth)/code.tsx
└── (home)/
    ├── map.tsx
    ├── play/[subject]/index.tsx
    ├── play/result.tsx
    └── trophies.tsx
```

---

## Message 7 — User
Créer un prompt complet pour le site vitrine Next.js avec mockdata, commandes d'installation, étapes

---

## Message 8 — Assistant

### Prompt Site Vitrine EduSmart

**Stack** : Next.js 14, Tailwind CSS, Shadcn/ui, Framer Motion, Mock data

**Couleurs** : `#1A4D3A` (vert), `#C9A84C` (or), `#FAFAF8` (crème)
**Fonts** : Playfair Display (titres), DM Sans (corps)

```bash
npx create-next-app@14 edusmart-vitrine \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd edusmart-vitrine
npm install framer-motion lucide-react clsx tailwind-merge
npx shadcn-ui@latest init
npx shadcn-ui@latest add button badge card separator navigation-menu sheet
npm run dev
```

```typescript
// tailwind.config.ts
colors: {
  "green-deep":  "#1A4D3A",
  "green-mid":   "#2D6A4F",
  "green-light": "#40916C",
  "gold":        "#C9A84C",
  "cream":       "#FAFAF8",
}

// lib/mock-data.ts
export const SCHOOL_INFO = {
  name: "EduSmart STRELITZIA",
  tagline: "Excellence académique, apprentissage adaptatif",
  address: "Lot II M 85, Antananarivo 101, Madagascar",
  foundedYear: 2018,
  stats: { students: 1240, teachers: 68, successRate: 97, programs: 12 },
}

export const PROGRAMS: Program[] = [
  { id:"p1", slug:"primaire", title:"École Primaire", level:"CP → CM2", duration:"6 ans", color:"#1A4D3A" },
  { id:"p2", slug:"college",  title:"Collège",        level:"6ème → 3ème", duration:"4 ans", color:"#C9A84C" },
  { id:"p3", slug:"lycee",    title:"Lycée Général",  level:"2nde → Terminale", duration:"3 ans", color:"#2D6A4F" },
  { id:"p4", slug:"langue",   title:"Section Bilingue", level:"Tous niveaux", color:"#40916C" },
]
```

---

## Message 9 — User
Compléter le document de proposition de mémoire UAZ

---

## Message 10 — Assistant

### Document Word — Proposition_Memoire_EduSmart.docx

**Thématique** : Intelligence artificielle appliquée à la gestion scolaire

**Titre** : *« Conception et développement d'un système intégré de gouvernance scolaire et d'apprentissage adaptatif assisté par intelligence artificielle : plateforme EduSmart »*

**Problématique** : Fragmentation gestion scolaire à Madagascar (papier, Excel non partagés, pas de visibilité parents). Détection tardive des difficultés. Pas de suivi adaptatif.

**Objectif général** : Concevoir une plateforme web et mobile intégrée adaptable à tout établissement scolaire.

**Objectifs spécifiques** :
1. Analyser besoins réels d'un établissement
2. Concevoir architecture modulaire (Core, Académique, IA, Communication)
3. Développer module IA (détection décrochage, recommandations)
4. Implémenter app enfant gamifiée
5. Déployer et évaluer en conditions réelles

**Méthodologie** : Approche mixte qualitative + expérimentale + développement logiciel

**Stack** : Next.js, Expo, Electron, Supabase, OpenRouter, Vercel, EAS

**5 phases** : Analyse (M1) → Core admin (M1-2) → Académique (M1-2) → IA+mobile (M2-3) → Tests+rédaction (M3)

**Résultats attendus** : 70% réduction temps bulletins · 80% détection décrochage

**Références** :
- Baker & Inventado (2014). Educational data mining. Springer.
- Romero & Ventura (2020). Educational data mining. WIREs.
- UNESCO (2023). Rapport mondial éducation.
- KECHAI H. (2018). Learning analytics. Academia.edu
- AFD (2018). Numérique et éducation en Afrique.
- Supabase, OpenRouter, Vercel, Expo Documentation (2026)

---

## Message 11 — User
Faire un résumé humain pour répondre aux questions lors de la présentation

---

## Message 12 — Assistant

### 8 Q&R pour la présentation

| Q | Réponse courte |
|---|---|
| C'est quoi ? | Plateforme numérique complète pour les écoles. Remplace papier/Excel. IA de détection décrochage. |
| Quel problème ? | Gestion fragmentée : erreurs bulletins, détection tardive, zéro communication école-famille. |
| Pourquoi l'IA ? | Analyse continue notes + absences → score risque 4 semaines avant examens. |
| Quelles technos ? | Next.js, Expo, Electron, Supabase, OpenRouter — modernes, gratuites, offline OK. |
| Livrables ? | Site web admin, 2 apps mobiles, app desktop, rapport mémoire. |
| Durée ? | 3 mois, 5 phases chevauchantes. |
| Original ? | Pas adapté à Madagascar dans l'existant (coût, offline, Mobile Money, SMS local). |
| Pourquoi ce sujet ? | Je travaille à STRELITZIA SCHOOL, je vis le problème au quotidien. |

---

## Message 13 — User
Format Word

---

## Message 14 — Assistant
Document Word `Resume_Presentation_Memoire.docx` généré.

---

## Message 15 — User
Changer la logique : le projet pour toutes les écoles (supprimer STRELITZIA)

---

## Message 16 — Assistant

**Modifications dans Proposition_Memoire_EduSmart.docx :**
- Titre : "plateforme EduSmart" (sans STRELITZIA)
- Objectif : "adaptable à tout établissement scolaire"
- Problématique : "déployable dans tout type d'établissement, du primaire au lycée"
- Phase 1 : "entretiens auprès d'établissements scolaires"

---

## Message 17 — User
Décrire les processus multi-écoles (École A et École B)

---

## Message 18 — Assistant

### Architecture Multi-Établissements

**Principe** : `organization_id` unique par école. RLS Supabase garantit l'isolation.

```sql
-- Politique RLS
CREATE POLICY "school_isolation" ON students
FOR ALL
USING (organization_id = current_user_organization_id());
```

**5 étapes d'inscription :**
1. Formulaire sur edusmart.site/register
2. Validation super-admin
3. Création automatique organisation + compte directeur + email invitation
4. Configuration logo/couleurs/programmes
5. Utilisation avec filtrage SQL automatique

**École A vs École B :**

| Élément | École A | École B |
|---|---|---|
| organization_id | abc-123 | xyz-789 |
| Barème | Sur 20 | Sur 100 |
| Seuil IA | 60% | 70% |
| URL | ecoleA.edusmart.site | ecoleB.edusmart.site |
| Accès croisé | ❌ IMPOSSIBLE | ❌ IMPOSSIBLE |

---

## Message 19 — User
Réaliste : comment avoir ecole-a.edusmart.com, comment ne pas confondre les scores de jeux

---

## Message 20 — Assistant

### Sous-domaines Vercel — Wildcard

```typescript
// middleware.ts
const host = req.headers.get('host') ?? ''
const slug = host.replace('.edusmart.mg', '').split('.')[0]
// → slug = "ecole-a"
requestHeaders.set('x-school-slug', slug)
```

**Contrainte** : NS Vercel obligatoires pour wildcard SSL :
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Scores de jeu — Isolation

```sql
INSERT INTO game_scores (
  organization_id,  -- "abc-123" (École A)
  student_id,       -- "marie-rakoto-001"
  subject,          -- "mathematiques"
  score,            -- 87
  played_at         -- now()
)
```

```sql
-- Classement toujours filtré école + classe
SELECT student_name, score FROM game_scores
WHERE organization_id = "abc-123"
AND class_id = "6eme-A"
ORDER BY score DESC LIMIT 10;
```

---

## Message 21 — User
Comment acheter edusmart.mg et configurer Vercel ?

---

## Message 22 — Assistant

**Registrars .mg** :
- Madagascar Internet (madagascar-internet.mg) — recommandé
- Tranokala (tranokala.pro)
- Netim, Gandi, OVH

**Étapes Vercel** :
1. NS → `ns1.vercel-dns.com` + `ns2.vercel-dns.com` (OBLIGATOIRE wildcard)
2. Settings → Domains : `edusmart.mg` puis `*.edusmart.mg`
3. SSL auto

**middleware.ts** :
```typescript
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const slug = host.split('.')[0] // "ecole-a"
  requestHeaders.set('x-school-slug', slug)
  return NextResponse.next({ request: { headers } })
}
```

---

## Message 23 — User
LWS edusmart.site (offre gratuite) suffit ?

---

## Message 24 — Assistant

**Domaine edusmart.site** ✅ Suffisant (prototype/mémoire)
**Hébergement LWS 1Go PHP/MySQL** ❌ Inutile (Vercel + Supabase utilisés)

Recommandation : edusmart.site pour le mémoire → migrer edusmart.mg pour déploiement réel.

---

## Message 25 — User
Versioning GitHub CI/CD vers edusmart.site

---

## Message 26 — Assistant

### Pipeline CI/CD

**4 branches** : `feature/*` → `develop` → `staging` → `main`

**Déploiements automatiques** :
- `feature/*` → Preview URL Vercel
- `staging` → staging.edusmart.site
- `main` → *.edusmart.site (production)

```bash
git checkout -b feature/module-ia
git add . && git commit -m "feat: ajout détection décrochage OpenRouter"
git push origin feature/module-ia
# → Pull Request → merge → Vercel déploie auto
git tag v1.0.0 && git push --tags
```

```yaml
# .github/workflows/ci.yml
name: CI — EduSmart
on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
```

---

## Message 27 — User
Schéma liaison, nom dossiers, architecture des projets

---

## Message 28 — Assistant

### Monorepo EduSmart — 5 apps + 2 packages

```
edusmart/
├── apps/
│   ├── vitrine/    → @edusmart/vitrine  (port 3001) Next.js 14
│   ├── admin/      → @edusmart/admin    (port 3002) Next.js 14
│   ├── mobile/     → @edusmart/mobile   Expo SDK 51
│   ├── kids/       → @edusmart/kids     Expo SDK 51
│   └── desktop/    → @edusmart/desktop  Electron 30
├── packages/
│   ├── shared/     → @edusmart/shared   types, hooks, Supabase client
│   └── ui/         → @edusmart/ui       design system, tokens
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .github/workflows/
├── .env.example
└── README.md
```

---

## Message 29 — User
Architecture des fichiers complet avec explications

---

## Message 30 — Assistant

### Architecture détaillée chaque app

#### apps/vitrine
```
src/app/
├── layout.tsx          ← Nav + Footer + Fonts globaux
├── page.tsx            ← Hero, Stats, Programmes, News
├── about/page.tsx      ← Histoire, valeurs, équipe
├── programs/page.tsx   ← Filières scolaires
├── news/
│   ├── page.tsx
│   └── [slug]/page.tsx ← Article (generateStaticParams)
├── contact/page.tsx    ← Formulaire inscription famille
└── api/contact/route.ts← POST → Supabase leads
middleware.ts           ← lit sous-domaine → identifie école
```

#### apps/admin
```
src/app/
├── (auth)/login/page.tsx
├── (dashboard)/
│   ├── layout.tsx          ← Sidebar + vérif session
│   ├── dashboard/page.tsx  ← KPI globaux
│   ├── students/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── grades/
│   │   ├── page.tsx
│   │   └── bulletins/page.tsx
│   ├── staff/[id]/page.tsx
│   ├── schedule/page.tsx
│   ├── finance/page.tsx
│   ├── ai-insights/page.tsx
│   └── settings/page.tsx
└── api/
    ├── grades/route.ts
    ├── pdf/route.ts
    └── ai/route.ts
```

#### apps/mobile
```
app/
├── _layout.tsx           ← Root layout + auth guard
├── (auth)/
│   ├── login.tsx         ← email + mot de passe
│   └── onboarding.tsx    ← 3 slides 1ère ouverture
└── (tabs)/
    ├── _layout.tsx       ← 4 onglets bottom
    ├── index.tsx         ← Accueil résumé
    ├── grades/
    │   ├── index.tsx
    │   ├── [subject].tsx ← graphique évolution
    │   └── bulletin.tsx
    ├── attendance/index.tsx
    ├── messages/
    │   ├── index.tsx
    │   └── [teacherId].tsx
    └── profile/index.tsx
hooks/
├── useStudent.ts
└── useRealtime.ts
```

#### apps/kids
```
app/
├── (auth)/code.tsx         ← saisie code élève (clavier large)
└── (home)/
    ├── map.tsx             ← carte monde matières
    ├── play/
    │   ├── [subject]/index.tsx ← mini-jeu adaptatif
    │   └── result.tsx
    ├── trophies.tsx
    └── me.tsx
components/
├── QCMGame.tsx
├── DragDropGame.tsx
├── AvatarBuilder.tsx
└── StarReward.tsx
assets/lottie/, sounds/
```

#### apps/desktop
```
electron/
├── main.ts         ← point d'entrée Electron
├── preload.ts      ← pont sécurisé main ↔ renderer
├── db.ts           ← SQLite (better-sqlite3)
├── sync.ts         ← sync SQLite ↔ Supabase (last-write-wins)
└── print.ts        ← impression native
src/pages/
├── Dashboard.tsx
├── Students.tsx
├── GradeEntry.tsx  ← tableau Excel-like 30 élèves
├── Bulletins.tsx
├── Certificates.tsx
└── Sync.tsx
electron-builder.yml
```

#### packages/shared
```
src/
├── types/
│   ├── organization.ts
│   ├── student.ts
│   ├── grade.ts
│   ├── staff.ts
│   └── ai.ts
├── supabase/
│   ├── client.ts           ← 1 instance Supabase partagée
│   └── database.types.ts   ← auto-généré CLI Supabase
├── hooks/
│   ├── useOrg.ts
│   ├── useSession.ts
│   └── useStudent.ts
└── utils/
    ├── gradeCalc.ts        ← calcul moyennes + pondérations
    ├── slugify.ts          ← "École A" → "ecole-a"
    └── riskScore.ts        ← algorithme décrochage local
```

---

## Message 31 — User
Exemples réels : strelitzia.edusmart.site, uaz.edusmart.site, edusmart.site, login

---

## Message 32 — Assistant

### URLs réelles EduSmart

```
edusmart.site              → landing platform (directeurs)
edusmart.site/register     → inscription nouvelle école
edusmart.site/admin        → super-admin (Randrianarison D.D.)
test.edusmart.site         → ✅ page de debug LIVE
strelitzia.edusmart.site   → vitrine STRELITZIA SCHOOL
strelitzia.edusmart.site/login     → connexion unique tous rôles
strelitzia.edusmart.site/admin     → admin STRELITZIA
strelitzia.edusmart.site/dashboard → parents & élèves
uaz.edusmart.site          → vitrine UAZ
uaz.edusmart.site/admin    → admin UAZ
```

### Login — logique Supabase

```typescript
// Après login → redirection par rôle
const role  = user.user_metadata.role
const orgId = user.user_metadata.organization_id

// Vérification école
if (orgId !== currentSchoolId) {
  redirect('/login?error=wrong-school')
}

// Redirection
switch (role) {
  case "director":   → '/admin/dashboard'
  case "teacher":    → '/admin/grades'
  case "secretary":  → '/admin/students'
  case "parent":     → '/dashboard'
  case "student":    → '/dashboard/student'
}
```

### Table users Supabase
```json
{
  "id": "uuid-parent-001",
  "email": "parent.marie@gmail.com",
  "user_metadata": {
    "role": "parent",
    "organization_id": "str-uuid-xxx",
    "student_ids": ["eleve-marie-001"]
  }
}
```

### 6 Rôles
| Rôle | Accès |
|---|---|
| super_admin | edusmart.site/admin — toutes les écoles |
| director | Tout /admin de son école |
| teacher | /admin/grades et /admin/quiz — SES classes |
| secretary | /admin/students, bulletins |
| parent | /dashboard — SES enfants |
| student/kid | /dashboard — son profil |

### App mobile APK
```typescript
const { data } = await supabase.auth.signInWithPassword({ email, password })
const orgId = data.user.user_metadata.organization_id
const school = await getSchoolById(orgId)
// → charge logo + couleurs → theming dynamique
```

### App kids — 3 connexions
```json
// QR Code
{ "student_code": "STR-2025-042", "org_id": "str-uuid-xxx", "expires_at": "2026-08-31" }
```
```
Option 1 : QR Code (recommandé)
Option 2 : Google OAuth
Option 3 : Code "STR-2025-042" + PIN 4 chiffres
```

### Quiz admin
```json
{
  "id": "quiz-001",
  "organization_id": "str-uuid-xxx",
  "class_id": "6eme-A",
  "subject": "mathematiques",
  "questions": [],
  "published_at": "2025-05-16"
}
```

### App desktop
```
1. Télécharger EduSmart-Desktop-Setup.exe
2. Saisir URL école + email + mdp → sync SQLite
3. Utilisation : notes, bulletins, attestations, emplois du temps
4. Sync auto quand internet disponible

États sync :
● Connecté  → sync auto toutes 5 min
● Hors-ligne → SQLite local, 0 perte
● Conflit    → last-write-wins
```

---

## Message 33 — User
Reçu email LWS : edusmart.site prêt, compte LWS-807771

---

## Message 34 — Assistant

**Commandes d'installation domaine :**

1. Se connecter panel.lws.fr (LWS-807771)
2. Zone DNS → ajouter :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | test | cname.vercel-dns.com. |
| CNAME | * | cname.vercel-dns.com. |

3. Vercel → Settings → Domains → `edusmart.site` + `*.edusmart.site`

---

## Message 35 — User
[Screenshot LWS DNS — ns21-ns24.lwsdns.com — Zone DNS avancée]

---

## Message 36 — Assistant

**DNS Records LWS Zone DNS :**

```
A      @        76.76.21.21                                 30min
A      mail     213.255.195.65                              30min
CNAME  test     7c280f9aadf5f882.vercel-dns-017.com.        30min
CNAME  *        7c280f9aadf5f882.vercel-dns-017.com.        30min
MX     @        mail.edusmart.site.  (priorité 10)          30min
TXT    _vercel  vc-domain-verify=XXXXX                      30min
```

---

## Message 37 — User
Étapes depuis le début pour configurer test.edusmart.site

---

## Message 38 — Assistant

### Guide 4 phases

**Phase 1 — LWS DNS (5 min)**
```
A      @      → 76.76.21.21
CNAME  test   → 7c280f9aadf5f882.vercel-dns-017.com.
CNAME  *      → 7c280f9aadf5f882.vercel-dns-017.com.
TXT    _vercel → vc-domain-verify=XXXXX
TTL : 30 minutes sur chaque
```

**Phase 2 — GitHub + Code (10 min)**
```bash
mkdir edusmart && cd edusmart
git init && git branch -M main
mkdir -p apps packages .github/workflows

# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

# Créer apps/test
cd apps
pnpm create next-app@14 test --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

**middleware.ts**
```typescript
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  const slug = host.replace(`.${rootDomain}`, '').replace(':3005', '').split('.')[0]
  const headers = new Headers(req.headers)
  headers.set('x-school-slug', slug)
  return NextResponse.next({ request: { headers } })
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**page.tsx debug**
```tsx
export default function TestPage() {
  const slug = headers().get('x-school-slug') ?? 'inconnu'
  const host = headers().get('host') ?? 'inconnu'
  return (
    <main className="min-h-screen bg-gray-950 text-white p-12">
      <div className="text-green-400 text-sm">● SYSTÈME OPÉRATIONNEL</div>
      <h1>EduSmart <span className="text-yellow-400">Test</span></h1>
      <p>Host : {host}</p>
      <p>Slug : <strong className="text-yellow-400">{slug}</strong></p>
      <p className="text-green-400">✓ Middleware actif</p>
      <p className="text-green-400">✓ Wildcard DNS OK</p>
    </main>
  )
}
```

```bash
pnpm install
pnpm dev:test  # → localhost:3005
git add . && git commit -m "feat: init monorepo + apps/test"
git remote add origin https://github.com/dieudonne261/EduSmart.git
git push -u origin main
```

**Phase 3 — Vercel (10 min)**
```
Project Name   : edusmart-test
Root Directory : apps/test
Build Command  : cd ../.. && pnpm install && pnpm --filter=@edusmart/test build
Framework      : Next.js
```
→ Settings → Domains → `test.edusmart.site`
→ Copier TXT _vercel → coller dans LWS

**Phase 4 — Vérification**
```bash
nslookup test.edusmart.site
# → 7c280f9aadf5f882.vercel-dns-017.com
open https://test.edusmart.site
# ✅ Host: test.edusmart.site | Slug: test
```

---

## Message 39 — User
[Screenshot Vercel Production Deployment — edu-smart-test.vercel.app — Ready]

---

## Message 40 — Assistant
🎉 Déployé ! Cliquer Settings → Domains → "Add Custom Domain" → `test.edusmart.site`

---

## Message 41 — User
Vercel affiche CNAME : test → 7c280f9aadf5f882.vercel-dns-017.com.

---

## Message 42 — Assistant
Mettre cette valeur dans LWS Zone DNS :

| Type | Nom | Valeur |
|---|---|---|
| CNAME | test | 7c280f9aadf5f882.vercel-dns-017.com. |

Vérifier : `nslookup test.edusmart.site` → doit retourner la nouvelle valeur.

---

## Message 43 — User
Étapes configuration APIs et récupération clés

---

## Message 44 — Assistant

### Variables d'environnement complètes

```dotenv
# Supabase — supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Domaine
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site

# Email (Resend) — resend.com → API Keys
RESEND_API_KEY=re_...

# OpenRouter — openrouter.ai → Keys
OPENROUTER_API_KEY=sk-or-...

# SMS Twilio / Africa's Talking
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

**Ordre de priorité :**
1. MAINTENANT : Supabase (base indispensable)
2. Phase 2 : Email LWS inclus + Resend pour emails auto
3. Phase 3 : OpenRouter (module IA)
4. Phase 4 : Twilio/Africa's Talking SMS

**LWS Mail inclus — créer dans panel.lws.fr :**
```
contact@edusmart.site
admin@edusmart.site

IMAP : mail.edusmart.site  Port 993  SSL
SMTP : mail.edusmart.site  Port 465  SSL
```

**Supabase — Région Singapore** (plus proche Madagascar)

---

## Message 45 — User
[Screenshots Outlook IMAP erreur mail.edusmart.site]

---

## Message 46 — Assistant

**Cause** : CNAME `*` interceptait `mail.edusmart.site` → Vercel au lieu de LWS.

**Solution LWS Zone DNS :**

| Type | Nom | Valeur |
|---|---|---|
| A | mail | 213.255.195.65 (IP MAIL LWS) |
| MX | @ | mail.edusmart.site. (priorité 10) |

Vérification : `nslookup mail.edusmart.site` → doit retourner 213.255.195.65

---

## Message 47 — User
Page Resend "Add domain" — région ?

---

## Message 48 — Assistant

```
Name   : edusmart.site
Region : Ireland (eu-west-1)  ← plus proche Madagascar
```

Resend affichera des DNS à ajouter dans LWS :
```
TXT  resend._domainkey.edusmart.site → p=MII...
MX   send.edusmart.site              → feedback-smtp.eu-west-1.amazonses.com.
TXT  send.edusmart.site              → v=spf1 include:...
```

---

## Message 49 — User
Architecture multi-établissements — création automatique

---

## Message 50 — Assistant

### Logique création automatique école

**Principe fondamental** : UN seul code Next.js. Les données viennent de Supabase.

```typescript
// middleware.ts — différencie root et école
if (host === rootDomain) {
  headers.set('x-school-slug', '__root__')  // edusmart.site marketing
} else {
  const slug = host.replace(`.${rootDomain}`, '')
  headers.set('x-school-slug', slug)        // ecole.edusmart.site
}

// layout.tsx — charge les bonnes données
if (slug === '__root__') return <RootLayout>...</RootLayout>
const school = await supabase.from('organizations').select('*').eq('slug', slug).single()
if (!school) notFound()
return <SchoolLayout school={school}>...</SchoolLayout>
```

**Edge Function on_school_approved.ts :**
```typescript
// Déclenchée quand status → "approved"
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
```

**Stockage vitrine :**

| Table Supabase | Contenu |
|---|---|
| organizations | slug, nom, logo, couleurs, adresse |
| vitrine_settings | tagline, banner, sections visibles |
| programs | filières par org_id |
| news_articles | actualités par org_id |
| team_members | équipe par org_id |

**Supabase Storage :**
```
vitrine/
├── uaz/logo.png
├── uaz/banner.jpg
└── strelitzia/logo.png
```

**Ce que l'admin peut modifier depuis /admin/settings/vitrine :**
- Logo, banner, favicon
- Couleurs primaire/secondaire
- Textes, tagline, adresse
- Chiffres clés (élèves, taux réussite)
- Programmes, actualités, équipe
- Sections visibles/cachées

```typescript
// Server Action — mise à jour instantanée
await supabase.storage.from('vitrine').upload(`${org_id}/logo.png`, logo, { upsert: true })
await supabase.from('organizations').update({ name, tagline, colors }).eq('id', org_id)
revalidatePath('/') // → vitrine mise à jour immédiatement
```

---

## Message 51 — User
Et mon site vitrine edusmart.site ?

---

## Message 52 — Assistant

### edusmart.site ≠ strelitzia.edusmart.site

| Site | Public | CTA |
|---|---|---|
| strelitzia.edusmart.site | Familles, parents | "Inscrire mon enfant" |
| edusmart.site | Directeurs d'école | "Inscrire mon école" |

**Pages edusmart.site :**
```
/           → Landing marketing (Hero + Features + Comment ça marche + Témoignages + Tarifs)
/features   → Fonctionnalités détaillées
/pricing    → Plans (Gratuit <100 élèves / Starter / Pro)
/register   → Formulaire inscription école → Supabase school_requests
/login      → Super-admin uniquement (toi)
/admin      → Dashboard super-admin
/demo       → Visite guidée interactive
```

**Structure code :**
```
apps/vitrine/src/app/
├── page.tsx           ← détecte __root__ ou école
├── (root)/            ← site marketing edusmart.site
│   ├── layout.tsx
│   ├── page.tsx       ← Hero, Features, Témoignages, Tarifs
│   ├── features/
│   ├── pricing/
│   ├── register/
│   └── login/
└── (school)/          ← vitrines écoles
    ├── layout.tsx
    ├── page.tsx
    ├── about/
    ├── programs/
    ├── news/[slug]/
    └── contact/
```

```typescript
// Tri dans page.tsx racine
if (slug === '__root__') return <RootHomePage />
return <SchoolHomePage slug={slug} />
```

---

## Message 53 — User
Login de chaque app — logique, où est le code, redirections

---

## Message 54 — Assistant

### Logique login par app

**Vue d'ensemble :**
| App | Login URL | Rôles |
|---|---|---|
| edusmart.site | /login | super_admin |
| *.edusmart.site | /login | director, teacher, secretary, parent, student |
| App mobile | écran Login.tsx | parent, student |
| App kids | écran code.tsx | kid (QR/code/Google) |
| Desktop | fenêtre Login | director, secretary |

**Web — strelitzia.edusmart.site/login :**
```typescript
// apps/vitrine/src/app/(school)/(auth)/login/actions.ts
'use server'
export async function loginAction(formData: FormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: 'Email ou mot de passe incorrect' }

  const role   = data.user.user_metadata.role
  const orgId  = data.user.user_metadata.organization_id
  const currOrg = headers().get('x-org-id')

  if (orgId !== currOrg) {
    return { error: 'Ce compte appartient à une autre école' }
  }

  const redirectMap = {
    director:  '/admin/dashboard',
    teacher:   '/admin/grades',
    secretary: '/admin/students',
    parent:    '/dashboard',
    student:   '/dashboard/student',
  }
  redirect(redirectMap[role] ?? '/')
}
```

**Middleware protection routes :**
```typescript
if (!session && (path.startsWith('/admin') || path.startsWith('/dashboard'))) {
  return NextResponse.redirect('/login')
}
if (session?.role === 'teacher' && path.startsWith('/admin/students')) {
  return NextResponse.redirect('/admin/grades')
}
```

**Super-admin edusmart.site/login :**
```typescript
if (data.user.user_metadata.role !== 'super_admin') {
  await supabase.auth.signOut()
  return { error: 'Accès refusé' }
}
redirect('/admin/dashboard')
```

**Mobile Expo :**
```typescript
// apps/mobile/app/_layout.tsx
supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session)
  if (!session) router.replace('/(auth)/login')
})
```

**App kids — 3 options :**
```typescript
// Option QR Code
async function handleQRScan(qrData: string) {
  const { student_code, org_id } = JSON.parse(qrData)
  const { data: student } = await supabase.from('students')
    .select('id, name, class_id')
    .eq('student_code', student_code)
    .eq('organization_id', org_id)
    .single()
  const session = await createKidSession(student.id, org_id)
  router.replace('/(home)/map')
}

// Option code court + PIN
async function handleCodeLogin(code: string, pin: string) {
  const student = await getStudentByCode(code)
  const pinOk = await verifyPin(pin, student.pin_hash)
  if (!pinOk) return setError('Code incorrect')
  router.replace('/(home)/map')
}
```

**Stockage sessions :**
| App | Stockage | Durée |
|---|---|---|
| Web Next.js | Cookie httpOnly sécurisé | 1h + refresh auto |
| App mobile | iOS Keychain / Android Keystore | Jusqu'à déco |
| App kids | MMKV local chiffré | Toute l'année |
| Desktop | electron-store chiffré | Permanent |

---

## Message 55 — User
Après test.edusmart.site : récupérer .env, étapes suivantes, comment coder, tester, debugger, progression

---

## Message 56 — Assistant

### Roadmap développement — 5 phases séquentielles

**Phase 0 — Récupérer clés .env**
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
```
✅ Test : afficher dans page.tsx → "Supabase : ✅ connecté"

**Phase 1 — Tables Supabase**
```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  tagline TEXT, logo_url TEXT, colors JSONB DEFAULT '{"primary":"#1A4D3A"}',
  address TEXT, phone TEXT, email TEXT, city TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE school_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT, slug_wanted TEXT, director_email TEXT,
  status TEXT DEFAULT 'pending'
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
INSERT INTO organizations (slug, name, tagline, colors, city)
VALUES ('strelitzia','STRELITZIA SCHOOL','Excellence à Toamasina','{"primary":"#1A4D3A"}','Toamasina');
INSERT INTO organizations (slug, name, tagline, colors, city)
VALUES ('uaz','Université Adventiste Zurcher','Excellence chrétienne','{"primary":"#534AB7"}','Antananarivo');
```
✅ Test : Supabase Table Editor → 2 lignes dans organizations

**Phase 2 — packages/shared**
```typescript
// client.ts (browser)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
// server.ts
export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(URL, KEY, { cookies: { getAll: () => cookieStore.getAll() } })
}

// organization.ts type
export type Organization = {
  id: string; slug: string; name: string; tagline: string | null;
  logo_url: string | null; colors: { primary: string; secondary?: string };
  address: string | null; city: string | null; status: 'active' | 'suspended'
}
```
✅ Test : requête Supabase depuis apps/test → voir les écoles

**Phase 3 — Middleware complet**
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
✅ Test astuce local : `localhost:3001?school=strelitzia` → données STRELITZIA

**Phase 4 — Vitrine école**
```typescript
// layout.tsx
const slug = headers().get('x-school-slug')
if (slug === '__root__') return <RootLayout>...</RootLayout>
const { data: school } = await supabase.from('organizations').select('*')
  .eq('slug', slug!).eq('status', 'active').single()
if (!school) notFound()
const style = { '--color-primary': school.colors.primary }
return <html><body style={style}><SchoolNav school={school}/>{children}</body></html>
```
✅ Test : `?school=strelitzia` → vert · `?school=uaz` → violet · `?school=xyz` → 404

**Phase 5 — Login**
```sql
-- Créer user test dans Supabase → Auth → Users → Add
Email: directeur@strelitzia.test  Password: Test1234!
-- Ajouter profil
INSERT INTO profiles (id, organization_id, role, full_name)
VALUES ('[UUID]', (SELECT id FROM organizations WHERE slug='strelitzia'), 'director', 'Test Directeur');
```
✅ Test : login → redirect /admin/dashboard · mauvaise école → erreur · non connecté → /login

**Règle d'or** : Code → Test local → Debug → OK → Push GitHub → Vercel déploie → Test production → OK → Phase suivante.

---

## Message 57 — User
Ajouter assistant IA dans chaque vitrine, stockage local si anonyme, outils admin avec OpenRouter, mettre à jour les tests

---

## Message 58 — Assistant

### Assistant IA — 3 niveaux

**Niveau 1 — Anonyme** : chat IA basique, historique localStorage
**Niveau 2 — Parent/Élève connecté** : chat personnalisé, historique Supabase
**Niveau 3 — Admin/Enseignant** : génération leçons, quiz, bulletins, analyses

**Route API streaming :**
```typescript
// apps/vitrine/src/app/api/chat/route.ts
export async function POST(req: NextRequest) {
  const { messages, userRole } = await req.json()
  const slug = headers().get('x-school-slug')
  const school = await getSchoolBySlug(slug)

  const systemPrompt = `Tu es l'assistant de ${school.name}, une école à ${school.city}.
Tu aides les visiteurs à en savoir plus sur l'école. Réponds en français, sois bienveillant et concis.`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
    body: JSON.stringify({
      model:    'mistralai/mistral-7b-instruct',
      stream:   true,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
  })
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

**Chat Widget — localStorage si anonyme :**
```typescript
'use client'
const STORAGE_KEY = 'edusmart_chat_history'

export function ChatWidget({ school, user }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (user) {
      loadFromSupabase(user.id).then(setMessages) // connecté
    } else {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setMessages(JSON.parse(saved)) // anonyme
    }
  }, [user])

  async function sendMessage() {
    // ... streaming fetch('/api/chat')
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

**Route admin — génération leçon/quiz/appréciation :**
```typescript
// /api/ai/generate/route.ts
const prompts = {
  lesson: `Génère un plan de cours : Matière: ${subject}, Niveau: ${level}, Thème: ${theme}`,
  quiz:   `Génère ${count} QCM. Format JSON: [{question, choices:[4], correct_index}]`,
  appreciation: `Rédige 3 appréciations pour : moyenne=${avg}/20, absences=${absences}`,
}
const models = {
  lesson:       'anthropic/claude-3-haiku',
  quiz:         'mistralai/mistral-7b-instruct',
  appreciation: 'anthropic/claude-3-haiku',
}
```

**6 suppléments OpenRouter :**
| Fonctionnalité | Modèle | Utilité |
|---|---|---|
| Routage auto | openrouter/auto | Choisit le meilleur modèle |
| JSON structuré | response_format: json_object | Quiz fiables à parser |
| RAG documents | context injection | Règlement intérieur dans le chat |
| Multilingue | system prompt | FR/EN/Malgache auto |
| Fallback modèle | models: [claude, mistral] | Si Claude en panne |
| Contrôle budget | max_tokens | Chat: 300, Admin: 2000 |

```typescript
// JSON structuré — quiz garanti
body: JSON.stringify({
  model: 'mistralai/mistral-7b-instruct',
  max_tokens: 2000,
  response_format: { type: 'json_object' },
  messages: [{ role: 'user', content: `Génère 5 QCM. JSON: {"questions":[...]}` }]
})

// Fallback modèle
models: ['anthropic/claude-3-haiku', 'mistralai/mistral-7b-instruct'],
route: 'fallback',
```

**Tests de validation :**
```
✅ LOCAL
□ Bouton 💬 visible bas-droite
□ Chat s'ouvre au clic
□ Réponse streaming (effet machine à écrire)
□ Rafraîchir → historique toujours là (localStorage)
□ Console → aucune erreur rouge
□ Network → /api/chat status 200

✅ PRODUCTION (test.edusmart.site)
□ Même comportement
□ Vercel logs → aucune erreur
□ Si 500 → OPENROUTER_API_KEY manquante dans Vercel Env Vars
```

**Règle de validation :**
```
✅ Local OK + Prod OK    → commit "test: [feature] validée" → phase suivante
❌ Erreur               → Console + Vercel logs + Network tab → corriger → retester
⚠️ Local OK, Prod KO   → variable d'env manquante dans Vercel (cas le plus fréquent)
```

---

# Annexes

## Blocs de code complets

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "lint":  { "dependsOn": ["^lint"] }
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### package.json racine
```json
{
  "name": "edusmart",
  "private": true,
  "scripts": {
    "dev:test":    "turbo run dev --filter=@edusmart/test",
    "dev:vitrine": "turbo run dev --filter=@edusmart/vitrine",
    "dev:admin":   "turbo run dev --filter=@edusmart/admin",
    "build":       "turbo run build",
    "lint":        "turbo run lint"
  },
  "devDependencies": { "turbo": "^2.0.0" },
  "packageManager": "pnpm@9.0.0"
}
```

### .env.example complet
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
OPENROUTER_API_KEY=sk-or-...
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

### SQL complet Supabase Phase 1
```sql
-- Tables
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, tagline TEXT,
  logo_url TEXT, colors JSONB DEFAULT '{"primary":"#1A4D3A"}',
  address TEXT, phone TEXT, email TEXT, city TEXT,
  status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE school_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT, slug_wanted TEXT, director_email TEXT,
  city TEXT, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL, full_name TEXT, avatar_url TEXT
);
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title TEXT, level TEXT, description TEXT, color TEXT DEFAULT '#1A4D3A'
);
CREATE TABLE news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title TEXT, excerpt TEXT, content TEXT, category TEXT,
  published BOOLEAN DEFAULT false, published_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_orgs" ON organizations FOR SELECT USING (true);
CREATE POLICY "public_read_programs" ON programs FOR SELECT USING (true);
CREATE POLICY "public_read_news" ON news_articles FOR SELECT USING (published = true);
CREATE POLICY "own_profile" ON profiles FOR ALL USING (id = auth.uid());

-- Données test
INSERT INTO organizations (slug, name, tagline, colors, city) VALUES
  ('strelitzia','STRELITZIA SCHOOL','Excellence à Toamasina','{"primary":"#1A4D3A","secondary":"#C9A84C"}','Toamasina'),
  ('uaz','Université Adventiste Zurcher','Excellence chrétienne','{"primary":"#534AB7","secondary":"#C9A84C"}','Antananarivo');
```

### GitHub Actions CI/CD complet
```yaml
name: CI — EduSmart
on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main]

jobs:
  build-test:
    name: Build & Type-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter=@edusmart/test type-check
      - run: pnpm --filter=@edusmart/test build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_ROOT_DOMAIN: edusmart.site
```

## Fichiers générés

| Fichier | Description |
|---|---|
| Proposition_Memoire_EduSmart.docx | Proposition mémoire Word complète UAZ |
| prompt_vitrine_edusmart.md | Prompt complet site vitrine Next.js |
| prompt_monorepo_edusmart.md | Prompt monorepo 6 apps |
| EduSmart_Architecture_Multi_Ecoles.docx | Doc architecture multi-écoles |
| Export_Conversation_EduSmart.md | Premier export conversation |
| Export_Conversation_EduSmart_V2.md | Ce fichier |

## DNS Records LWS — Configuration finale

```
Type   Nom       Valeur                                      TTL
─────────────────────────────────────────────────────────────────
A      @         76.76.21.21                                 30min
A      mail      213.255.195.65                              30min
CNAME  test      7c280f9aadf5f882.vercel-dns-017.com.        30min
CNAME  *         7c280f9aadf5f882.vercel-dns-017.com.        30min
MX     @         mail.edusmart.site.  (priorité 10)          30min
TXT    _vercel   vc-domain-verify=XXXXX                      30min
TXT    resend._domainkey  p=MII...                           30min
```

## Stack technologique complète

```
Frontend Web     : Next.js 14 (App Router, TypeScript strict)
Mobile           : Expo SDK 51 (React Native, EAS Build)
Desktop          : Electron 30 + React + Vite
Backend/DB       : Supabase (PostgreSQL, Auth JWT, RLS, Realtime, Storage, Edge Functions)
IA               : OpenRouter (Claude Haiku, GPT-4o, Mistral 7B, Llama)
Email auto       : Resend (3000/mois gratuit, région Ireland)
Email manuel     : LWS Mail (mail.edusmart.site, 993/465 SSL)
SMS              : Twilio / Africa's Talking (mieux pour Madagascar)
Monorepo         : Turborepo + pnpm workspaces
CI/CD            : GitHub Actions + Vercel Deploy + Expo EAS
Hébergement web  : Vercel (*.edusmart.site wildcard)
Domaine          : edusmart.site (LWS) → migration edusmart.mg prévue
Design           : Tailwind CSS + Shadcn/ui
Typographie      : Playfair Display (titres) + DM Sans (corps)
Chat IA          : OpenRouter streaming + localStorage anonyme + Supabase connecté
```

## URLs et Références

```
GitHub projet      : https://github.com/dieudonne261/EduSmart
Vercel projet      : https://vercel.com/dieudonne261s-projects/edu-smart-test
Commit initial     : 7224512022c23e28d4a5405e65f45b42a12eb7ec
test.edusmart.site : https://test.edusmart.site (LIVE)
panel.lws.fr       : https://panel.lws.fr (LWS-807771)
Supabase           : https://supabase.com/dashboard (à créer)
OpenRouter         : https://openrouter.ai
Resend             : https://resend.com
dnschecker.org     : https://dnschecker.org (vérifier propagation DNS)
docs.expo.dev      : https://docs.expo.dev
vercel.com/docs    : https://vercel.com/docs
supabase.com/docs  : https://supabase.com/docs
```

## Informations personnelles projet

```
Étudiant       : Randrianarison Dieu Donné
Matricule      : 30 014 MI
Université     : Université Adventiste Zurcher (UAZ)
Programme      : Master Informatique — Sciences de l'ingénieur
Email perso    : ddieu0970@gmail.com
Email étudiant : randrianarison.d@zurcher.edu.mg
Téléphone      : +261 34 12 722 76
École terrain  : STRELITZIA SCHOOL, Toamasina, Madagascar
Directeur      : A donné son accord de principe
Date mémoire   : Mai 2026
Domaine LWS    : edusmart.site (compte LWS-807771, validé le 16/05/2026)
GitHub user    : dieudonne261
Vercel user    : dieudonne261
```

---
*Export V2 — EduSmart STRELITZIA — Master Informatique UAZ — 19 Mai 2026*
ENDOFFILE
echo "✅ Export V2 généré ($(wc -l < /mnt/user-data/outputs/Export_Conversation_EduSmart_V2.md) lignes)"
Sortie

✅ Export V2 généré (1738 lignes)
Terminé

decrir les etapes par étape


