## Métadonnées
- **Date** : 17 Mai 2026
- **Session** : EduSmart STRELITZIA — Projet de mémoire Master Informatique
- **Langue** : Français
- **Utilisateur** : Randrianarison Dieu Donné (LWS-807771 / dieudonne261)
- **Université** : Université Adventiste Zurcher (UAZ)
- **Domaine acquis** : edusmart.site (LWS)
- **Déploiement** : edu-smart-test.vercel.app → test.edusmart.site

---

# Conversation Complète

---

## Message 1 — User
Détailler ce projet : vercel, application mobile avec expo, react ou next, supabase, Openrouter, github, site vitrine, desktop app, application pour enfant,...

**Titre du Projet A : EduSmart STRELITZIA**
Système Intégré de Gouvernance Scolaire et d'Apprentissage Adaptatif

Architecture Globale du Système :
- Module Core (Admin & RH) : Gère les inscriptions, le personnel et la paie
- Module Académique (Examens & Notes) : Logique de calcul, pondérations et génération de documents officiels
- Module IA (Suivi Adaptatif) : Analyse les notes et présences pour prédire le décrochage
- Gateway & Communication : Pour le portail parent et les notifications (SMS/Push)

---

## Message 2 — Assistant

### Architecture EduSmart STRELITZIA — 5 surfaces (frontends)

**Site vitrine** — Next.js déployé sur Vercel. Page publique de l'établissement.

**Admin web** — Next.js, accès restreint. Interface pour directeurs, RH, personnel administratif.

**App mobile** (parents & élèves) — Expo / React Native, iOS + Android.

**App desktop** — Electron + React, Windows/macOS.

**App enfant** — Expo, interface gamifiée.

### Les 4 modules backend
- Module Core (Admin & RH)
- Module Académique (Examens & Notes)
- Module IA (Suivi adaptatif) — OpenRouter (Claude, GPT-4o, Mistral)
- Gateway Communication — SMS, Push, Email

### Infrastructure
- **Supabase** : PostgreSQL, Auth JWT + RLS, Storage, Edge Functions, Realtime
- **GitHub + GitHub Actions** : CI/CD, tests, déploiement Vercel + Expo EAS

### Phases de construction
1. Phase 1 — Supabase + Auth + Module Core
2. Phase 2 — Module Académique + app admin web + génération bulletins
3. Phase 3 — App mobile parents + notifications push
4. Phase 4 — Module IA + OpenRouter + app enfant gamifiée
5. Phase 5 — App desktop Electron + site vitrine + déploiement production

---

## Message 3 — User
Donner le détail de chaque bloc par bloc

---

## Message 4 — Assistant

### 8 Blocs détaillés

**BLOC 01 — Site vitrine** (Next.js 14, Vercel, public)
- Page d'accueil publique
- Présentation programmes, enseignants
- Formulaire d'inscription → Supabase leads
- Actualités, calendrier scolaire
- SEO optimisé, multilingue
- Stack : Next.js 14, Tailwind CSS, Vercel, GitHub, Supabase

**BLOC 02 — Admin web** (Next.js 14, Vercel, accès restreint)
- Utilisateurs : Directeur, Secrétariat, RH, Comptabilité
- Dashboard KPI, emplois du temps drag & drop
- Génération bulletins PDF, suivi paiements scolarité
- Stack : Next.js 14, Supabase Auth, React Query, Recharts, Vercel

**BLOC 03 — App mobile parents & élèves** (Expo SDK 51, React Native)
- Notes & moyennes temps réel, présences, messagerie enseignants
- Paiement scolarité in-app (Mobile Money, carte)
- Bulletins téléchargeables PDF signés
- Stack : Expo Router, Supabase JS, Expo Notifs, EAS Build, MMKV

**BLOC 04 — App desktop** (Electron, React, offline)
- Mode hors-ligne avec SQLite local
- Impression directe bulletins, relevés, attestations
- Synchronisation SQLite ↔ Supabase
- Stack : Electron 30, React + Vite, SQLite local, electron-builder

**BLOC 05 — App enfant gamifiée** (Expo, 6-14 ans)
- Avatar personnalisable, mini-jeux (QCM, glisser-déposer, puzzle)
- Badges, étoiles, récompenses
- Contenu piloté par IA (OpenRouter)
- Difficulté adaptative temps réel
- Stack : Expo + Reanimated, Lottie, Supabase, OpenRouter, expo-av

**BLOC 06 — Supabase Gateway** (Auth & sécurité)
- JWT signé, refresh token automatique
- Rôles : super_admin, directeur, enseignant, parent, élève, enfant
- Row-Level Security (RLS)
- WebSocket Realtime, Edge Functions, Storage

**BLOC 07 — Module IA** (OpenRouter)
- Analyse notes sur 3 semaines → tendance à la baisse
- Score de risque de décrochage
- Recommandations de révision personnalisées
- Génération exercices adaptatifs app enfant
- Stack : OpenRouter, Claude Haiku, Mistral 7B, Edge Functions

**BLOC 08 — DevOps** (GitHub, Vercel, EAS)
- Push feature branch → tests Jest auto
- PR mergée → build Vercel Preview
- Tag release → déploiement production auto
- EAS Build pour iOS + Android
- EAS Update : hotfixes OTA
- Monitoring : Vercel Analytics, Sentry, Supabase logs

---

## Message 5 — User
Détaille la couche Frontend Web Next.js et Mobile Expo

---

## Message 6 — Assistant

### Next.js — Structure App Router

**apps/vitrine** (Next.js 14 App Router)
```
src/app/
├── layout.tsx          ← Nav · Footer · Fonts
├── page.tsx            ← Accueil
├── about/page.tsx      ← À propos
├── programs/page.tsx   ← Programmes
├── news/
│   ├── page.tsx        ← Liste actualités
│   └── [slug]/page.tsx ← Article individuel
├── contact/page.tsx    ← Inscription
└── api/contact/route.ts← POST → Supabase leads
```

**apps/admin** (Next.js 14, Auth middleware)
```
src/app/
├── middleware.ts           ← JWT guard
├── (auth)/login/page.tsx
├── (dashboard)/
│   ├── layout.tsx          ← Sidebar + Header
│   ├── dashboard/page.tsx  ← KPI
│   ├── students/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── grades/
│   │   ├── page.tsx
│   │   └── bulletins/page.tsx
│   ├── staff/[id]/page.tsx
│   └── reports/page.tsx
└── api/(grades|students|reports)/route.ts
```

### Expo Router — Apps mobiles

**apps/mobile** (Expo SDK 51)
```
app/
├── _layout.tsx
├── (auth)/login.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── index.tsx          ← Accueil
    ├── grades/
    │   ├── index.tsx
    │   ├── [subject].tsx
    │   └── bulletin.tsx
    ├── messages/[teacherId].tsx
    └── profile/index.tsx
```

**apps/kids** (Expo, gamifiée)
```
app/
├── (auth)/code.tsx        ← saisie code élève
└── (home)/
    ├── map.tsx
    ├── play/
    │   ├── [subject]/index.tsx ← mini-jeu
    │   └── result.tsx
    ├── trophies.tsx
    └── me.tsx
```

**Monorepo** : Turborepo · pnpm workspaces · TypeScript strict

---

## Message 7 — User
Créer un prompt complet pour générer ce site vitrine (apps/vitrine · Next.js 14 App Router) - pas d'utilisation de l'API pour l'instant, utilise le mockdata, donner les cmd, installation, étapes

---

## Message 8 — Assistant

### Prompt complet Site Vitrine EduSmart (fichier généré)

**Stack** : Next.js 14, Tailwind CSS v3, Shadcn/ui, Framer Motion, Mock data statique

**Couleurs** : vert forêt `#1A4D3A`, or doux `#C9A84C`, blanc cassé `#FAFAF8`
**Typographie** : Playfair Display (titres), DM Sans (corps)

#### Commandes d'installation
```bash
npx create-next-app@14 edusmart-vitrine \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd edusmart-vitrine
npm install framer-motion lucide-react clsx tailwind-merge
npx shadcn-ui@latest init
npx shadcn-ui@latest add button badge card separator navigation-menu sheet
npm run dev
```

#### Structure fichiers
```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── programs/page.tsx
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   └── home/HeroSection.tsx, StatsSection.tsx, ProgramsPreview.tsx, NewsPreview.tsx
├── lib/mock-data.ts
└── types/index.ts
```

#### Mock Data (extrait)
```typescript
export const SCHOOL_INFO = {
  name: "EduSmart STRELITZIA",
  tagline: "Excellence académique, apprentissage adaptatif",
  address: "Lot II M 85, Antananarivo 101, Madagascar",
  phone: "+261 20 22 XXX XX",
  email: "contact@edusmart-strelitzia.mg",
  foundedYear: 2018,
  stats: { students: 1240, teachers: 68, successRate: 97, programs: 12 },
}

export const PROGRAMS: Program[] = [
  { id: "p1", slug: "primaire", title: "École Primaire", level: "CP → CM2", duration: "6 ans", color: "#1A4D3A", ... },
  { id: "p2", slug: "college", title: "Collège", level: "6ème → 3ème", duration: "4 ans", color: "#C9A84C", ... },
  { id: "p3", slug: "lycee", title: "Lycée Général", level: "2nde → Terminale", duration: "3 ans", color: "#2D6A4F", ... },
  { id: "p4", slug: "langue", title: "Section Bilingue", level: "Tous niveaux", color: "#40916C", ... },
]
```

#### tailwind.config.ts
```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        "green-deep":  "#1A4D3A",
        "green-mid":   "#2D6A4F",
        "green-light": "#40916C",
        "gold":        "#C9A84C",
        "gold-light":  "#E8C96E",
        "cream":       "#FAFAF8",
        "warm-gray":   "#F5F3EE",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
}
```

#### Checklist Phase 2 (connexion Supabase)
- [ ] Créer tables Supabase : programs, news_articles, contact_leads
- [ ] Remplacer imports mock-data par appels supabase.from(...).select()
- [ ] Transformer contact/page.tsx en Server Action
- [ ] Ajouter variables d'environnement Supabase dans Vercel
- [ ] Activer ISR (revalidate) sur les pages news

---

## Message 9 — User
Compléter le document de proposition de mémoire (Université Adventiste Zurcher)

---

## Message 10 — Assistant

### Document Word généré : Proposition_Memoire_EduSmart.docx

**Section 2 — Thématique & Titre**
- Thématique : Intelligence artificielle appliquée à la gestion scolaire et à l'apprentissage adaptatif
- Titre : « Conception et développement d'un système intégré de gouvernance scolaire et d'apprentissage adaptatif assisté par intelligence artificielle : plateforme EduSmart »

**Section 3 — Problématique**
Fragmentation de la gestion scolaire à Madagascar : registres papier, Excel non partagés, absence de visibilité parents. Détection tardive des élèves en difficulté. Approches uniformes sans suivi adaptatif.

**Section 4 — Objectifs**
- Général : Concevoir une plateforme web et mobile intégrée adaptable à tout établissement
- Spécifiques : analyse besoins, architecture modulaire, module IA, app enfant gamifiée, évaluation

**Section 5 — Méthodologie**
- Approche mixte (qualitative + expérimentale + développement logiciel)
- Stack : Next.js, Expo, Electron, Supabase, OpenRouter, Vercel, EAS
- 5 phases de développement

**Section 6 — Résultats attendus**
- Plateforme web, 2 apps mobiles, app desktop, rapport mémoire
- Impact : 70% réduction temps bulletins, 80% détection décrochage

**Section 7 — Plan prévisionnel** : 10 mois (5 phases)

**Section 8 — Références** : 10 références académiques (Baker, Romero, UNESCO...)

---

## Message 11 — User
Faire un petit résumé humain pour répondre aux questions lors de la présentation

---

## Message 12 — Assistant

### 8 Questions-Réponses pour la présentation

**Q1** : C'est quoi concrètement ?
→ Plateforme numérique complète pour les écoles, remplace papier/Excel, ajoute IA de détection décrochage. Livré en premier à STRELITZIA SCHOOL Toamasina.

**Q2** : Quel problème résolvez-vous ?
→ Gestion fragmentée : erreurs bulletins, détection tardive difficultés, zéro communication école-famille.

**Q3** : Pourquoi l'IA est nécessaire ?
→ Analyse continue notes + absences → score risque décrochage 4 semaines avant examens. Objectif : 80% des cas détectés.

**Q4** : Quelles technologies et pourquoi ?
→ Next.js (web), Expo (mobile), Electron (desktop offline), Supabase (DB+auth), OpenRouter (LLM).

**Q5** : Livrables concrets ?
→ Site web admin, 2 apps mobiles, app desktop, rapport mémoire.

**Q6** : En combien de temps ?
→ 3 mois, 5 phases chevauchantes.

**Q7** : En quoi c'est original ?
→ Pas adapté à Madagascar (coût, offline, Mobile Money). Pas de suivi adaptatif dans les logiciels existants.

**Q8** : Pourquoi ce sujet pour le Master ?
→ Je travaille à STRELITZIA SCHOOL, je vis le problème au quotidien. Contribution à la recherche SIE en Afrique.

---

## Message 13 — User
Format Word

---

## Message 14 — Assistant
Document Word généré : **Resume_Presentation_Memoire.docx** (non finalisé dans la session)

---

## Message 15 — User
Changer la logique : le projet peut être pour toutes les écoles (supprimer STRELITZIA), redonner la Proposition mémoire EduSmart

---

## Message 16 — Assistant
Modifications apportées au document Word :
- Titre : suppression "cas de la plateforme EduSmart STRELITZIA" → "plateforme EduSmart"
- Objectif général : "EduSmart STRELITZIA" → "EduSmart — adaptable à tout établissement scolaire"
- Problématique : "déployable dans un établissement réel" → "déployable dans tout type d'établissement scolaire, du primaire au lycée"
- Phase 1 : "entretiens terrain" → "entretiens auprès d'établissements scolaires"
- Vérification : aucune référence STRELITZIA restante

---

## Message 17 — User
Décrire les processus multi-écoles (École A et École B), logique, étapes, sections utilisateurs

---

## Message 18 — Assistant

### Architecture Multi-Établissements EduSmart

#### Principe clé : organization_id unique par école

```sql
-- Toutes les données tagguées avec organization_id
SELECT * FROM students
WHERE organization_id = current_user_organization_id();
-- École A voit SES élèves uniquement
-- École B voit SES élèves uniquement
```

#### 5 étapes d'inscription d'une école

1. **Formulaire** : directeur remplit edusmart.site/register
2. **Validation** : super-admin approuve la demande
3. **Création automatique** : UUID, organization_id, compte admin, email invitation
4. **Configuration** : logo, barèmes, personnel, programmes
5. **Utilisation** : filtrage SQL automatique sur organization_id

#### Exemple École A vs École B

| Élément | École A | École B |
|---------|---------|---------|
| organization_id | abc-123 | xyz-789 |
| Logo | logo_ecoleA.png | logo_ecoleB.png |
| Barème | Sur 20 | Sur 100 |
| Seuil IA | 60% | 70% |
| URL parent | ecoleA.edusmart.site | ecoleB.edusmart.site |
| Accès données de l'autre | ❌ IMPOSSIBLE | ❌ IMPOSSIBLE |

#### Row-Level Security (RLS)
```sql
CREATE POLICY "school_isolation" ON students
FOR ALL
USING (organization_id = current_user_organization_id());
```

---

## Message 19 — User
Réaliste et logique : comment avoir ecole-a.edusmart.com, comment ne pas confondre les scores dans les jeux

---

## Message 20 — Assistant

### Question 1 : Sous-domaines sur Vercel

**Méthode** : Wildcard domain `*.edusmart.mg` sur Vercel + middleware Next.js

```bash
# Vercel Dashboard → Add domain
edusmart.mg
*.edusmart.mg
```

```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const slug = host
    .replace('.edusmart.mg', '')
    .replace('.edusmart.com', '')
    .split('.')[0]
  // → slug = "ecole-a"
  
  const headers = new Headers(req.headers)
  headers.set('x-school-slug', slug)
  return NextResponse.next({ request: { headers } })
}
```

**Contrainte** : NS Vercel obligatoires pour wildcard SSL

### Question 2 : Scores de jeu — isolation

**Connexion enfant** : code court `ATA-2025-042` généré par l'école
```sql
-- JWT contient : organization_id + student_id
-- Chaque score sauvegardé :
INSERT INTO game_scores (
  organization_id, -- "abc-123" (École A)
  student_id,      -- "marie-rakoto-001"
  subject,         -- "mathematiques"
  score,           -- 87
  played_at        -- now()
)
```

**Classement** : toujours filtré par organization_id + class_id
```sql
SELECT student_name, score FROM game_scores
WHERE organization_id = "abc-123"
AND class_id = "6eme-A"
AND subject = "mathematiques"
ORDER BY score DESC LIMIT 10;
```

---

## Message 21 — User
Comment acheter le domaine edusmart.mg et le configurer dans Vercel ?

---

## Message 22 — Assistant

### Guide domaine .mg + Vercel

**Registrars .mg** :
- Madagascar Internet (madagascar-internet.mg) — recommandé local
- Tranokala (tranokala.pro) — option locale ~19 000 Ar/an
- Netim, Gandi, OVH — international

**Étapes Vercel** :
1. Changer NS → `ns1.vercel-dns.com` et `ns2.vercel-dns.com`
2. Vercel Dashboard → Settings → Domains → ajouter :
   - `edusmart.mg`
   - `*.edusmart.mg`
3. SSL généré automatiquement

**Contrainte obligatoire** : NS Vercel requis pour wildcard SSL

**Timeline** : 5' achat + 5' NS + 48h propagation + 2' config Vercel + 30' code middleware

---

## Message 23 — User
Est-ce que l'offre LWS edusmart.site (Domaine Basic, gratuit à vie) suffit ?

---

## Message 24 — Assistant

**Domaine edusmart.site** ✅ Suffisant pour démarrer
- .site est un TLD générique valide
- Vérifier que LWS permet de changer les nameservers

**Hébergement 1 Go / PHP / MySQL** ❌ Inutile pour ce projet

| Ce que LWS offre | Ce qu'on utilise |
|---|---|
| 1 Go espace web | Vercel (serverless) |
| PHP | Next.js (Node.js) |
| MySQL | Supabase PostgreSQL |
| SSL inclus | Vercel génère son propre SSL |

**Recommandation** : edusmart.site pour le mémoire/prototype → migrer vers .mg pour déploiement réel

---

## Message 25 — User
Comment faire le versioning sur GitHub CI/CD du projet vers edusmart.site

---

## Message 26 — Assistant

### Pipeline GitHub CI/CD → Vercel

#### 4 branches Git
- `feature/*` → Preview deploy (URL unique Vercel)
- `develop` → intégration
- `staging` → staging.edusmart.site
- `main` → production `*.edusmart.site`

#### Commandes Git au quotidien
```bash
git checkout -b feature/module-ia
git add .
git commit -m "feat: ajout détection décrochage OpenRouter"
git push origin feature/module-ia
# Ouvrir Pull Request sur GitHub
git tag v1.0.0
git push --tags
```

#### .github/workflows/ci.yml
```yaml
name: CI — EduSmart
on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging, develop]

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

#### Variables Vercel par environnement
| Variable | Preview | Staging | Production |
|---|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | URL dev | URL staging | URL prod |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | clé dev | clé staging | clé prod |
| SCHOOL_SLUG_DOMAIN | vercel.app | staging.edusmart.site | edusmart.site |

---

## Message 27 — User
Quels sont les projets à développer, schéma de liaison, nom de chaque dossier et architecture

---

## Message 28 — Assistant

### Monorepo EduSmart — 5 applications + 2 packages

```
edusmart/
├── apps/
│   ├── vitrine/    → @edusmart/vitrine  (port 3001) Next.js
│   ├── admin/      → @edusmart/admin    (port 3002) Next.js
│   ├── mobile/     → @edusmart/mobile   Expo RN
│   ├── kids/       → @edusmart/kids     Expo RN
│   └── desktop/    → @edusmart/desktop  Electron
├── packages/
│   ├── shared/     → @edusmart/shared   types, hooks, utils, Supabase client
│   └── ui/         → @edusmart/ui       composants, design tokens
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .github/workflows/
├── .env.example
└── README.md
```

| App | Tech | URL | Utilisateur |
|---|---|---|---|
| vitrine | Next.js 14 | ecole-a.edusmart.site | Grand public |
| admin | Next.js 14 | admin.edusmart.site | Personnel école |
| mobile | Expo RN | App Store / Play Store | Parents, élèves |
| kids | Expo RN | App Store / Play Store | Enfants 6-14 ans |
| desktop | Electron | .exe / .dmg | Secrétariat |

---

## Message 29 — User
Donner nom de chaque dossier et architecture des fichiers complet, avec explication précise de chaque

---

## Message 30 — Assistant

### Architecture détaillée — chaque app

#### apps/vitrine
```
apps/vitrine/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Nav + Footer + Fonts globaux
│   │   ├── page.tsx            ← Accueil (Hero, Stats, Programmes, News)
│   │   ├── about/page.tsx      ← Histoire, valeurs, équipe
│   │   ├── programs/page.tsx   ← Liste des filières
│   │   ├── news/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx ← Article (generateStaticParams)
│   │   ├── contact/page.tsx    ← Formulaire inscription famille
│   │   └── api/contact/route.ts← POST → Supabase leads
│   ├── components/
│   │   ├── layout/Navbar.tsx   ← Navigation responsive + logo école
│   │   └── layout/Footer.tsx
│   └── middleware.ts           ← lit sous-domaine → identifie école
└── tailwind.config.ts
```

#### apps/admin
```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          ← Sidebar + Header + vérif session
│   │   │   ├── dashboard/page.tsx  ← KPI
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── grades/
│   │   │   │   ├── page.tsx
│   │   │   │   └── bulletins/page.tsx
│   │   │   ├── staff/[id]/page.tsx
│   │   │   ├── schedule/page.tsx
│   │   │   ├── finance/page.tsx
│   │   │   ├── ai-insights/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── grades/route.ts
│   │       ├── pdf/route.ts
│   │       └── ai/route.ts
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── DataTable.tsx
│   │   └── GradeSheet.tsx
│   └── middleware.ts
```

#### apps/mobile
```
apps/mobile/
├── app/
│   ├── _layout.tsx
│   ├── (auth)/login.tsx, onboarding.tsx
│   └── (tabs)/
│       ├── _layout.tsx         ← 4 onglets bottom
│       ├── index.tsx           ← Accueil résumé
│       ├── grades/
│       │   ├── index.tsx
│       │   ├── [subject].tsx
│       │   └── bulletin.tsx
│       ├── attendance/index.tsx
│       ├── messages/
│       │   ├── index.tsx
│       │   └── [teacherId].tsx
│       └── profile/index.tsx
├── hooks/
│   ├── useStudent.ts
│   └── useRealtime.ts
├── app.json
└── eas.json
```

#### apps/kids
```
apps/kids/
├── app/
│   ├── (auth)/code.tsx         ← saisie code élève (clavier large)
│   └── (home)/
│       ├── map.tsx             ← carte monde des matières
│       ├── play/
│       │   ├── [subject]/index.tsx ← mini-jeu adaptatif
│       │   └── result.tsx      ← score + animation Lottie
│       ├── trophies.tsx
│       └── me.tsx
├── components/
│   ├── QCMGame.tsx
│   ├── DragDropGame.tsx
│   ├── AvatarBuilder.tsx
│   └── StarReward.tsx
├── assets/lottie/, sounds/
└── eas.json
```

#### apps/desktop
```
apps/desktop/
├── electron/
│   ├── main.ts         ← point d'entrée Electron
│   ├── preload.ts      ← pont sécurisé main ↔ renderer
│   ├── db.ts           ← SQLite (better-sqlite3)
│   ├── sync.ts         ← sync SQLite ↔ Supabase
│   └── print.ts        ← impression native
├── src/
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Students.tsx
│       ├── GradeEntry.tsx  ← tableau Excel-like
│       ├── Bulletins.tsx
│       ├── Certificates.tsx
│       └── Sync.tsx
└── electron-builder.yml
```

#### packages/shared
```
packages/shared/
└── src/
    ├── types/
    │   ├── organization.ts
    │   ├── student.ts
    │   ├── grade.ts
    │   ├── staff.ts
    │   └── ai.ts
    ├── supabase/
    │   ├── client.ts           ← 1 instance Supabase pour tout
    │   └── database.types.ts   ← auto-généré par CLI Supabase
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
Décrire les processus multi-écoles avec exemples réels strelitzia.edusmart.site, uaz.edusmart.site, edusmart.site

---

## Message 32 — Assistant

### Architecture URL réelle — Logique complète

#### edusmart.site (super-admin)
```typescript
// Table users — super-admin
{
  email: "toi@edusmart.site",
  role: "super_admin",      // rôle spécial
  organization_id: null     // pas lié à une école
}
// Middleware edusmart.site/admin vérifie :
if (role !== "super_admin") → redirect "/" // accès refusé
```

#### strelitzia.edusmart.site — Middleware
```typescript
const host = req.headers.get('host')
// → "strelitzia.edusmart.site"
const slug = host.split('.')[0]
// → "strelitzia"
const school = await supabase
  .from('organizations')
  .select('id, name, logo, colors')
  .eq('slug', 'strelitzia')
  .single()
headers.set('x-org-id', school.id)
```

#### Login unique → redirection par rôle
```typescript
const { data: { user } } = await supabase.auth.getUser()
const role = user.user_metadata.role
const orgId = user.user_metadata.organization_id

// Vérification école
if (orgId !== currentSchoolId) {
  redirect('/login?error=wrong-school')
}

// Redirection par rôle
switch (role) {
  case "director":  → /admin/dashboard
  case "teacher":   → /admin/grades
  case "secretary": → /admin/students
  case "parent":    → /dashboard
  case "student":   → /dashboard
}
```

#### 6 rôles définis
| Rôle | Accès |
|---|---|
| super_admin | edusmart.site/admin — toutes les écoles |
| director | Tout /admin de son école |
| teacher | /admin/grades et /admin/quiz — SES classes |
| secretary | /admin/students, bulletins — pas finances |
| parent | /dashboard — SES enfants uniquement |
| student / enfant | /dashboard — son profil |

#### App mobile APK — Login dynamique
```typescript
const { data } = await supabase.auth.signInWithPassword({
  email: "parent@gmail.com",
  password: "motdepasse"
})
const orgId = data.user.user_metadata.organization_id
const school = await getSchoolById(orgId)
// → charge logo + couleurs → theming dynamique
```

#### App kids — 3 modes de connexion
1. **QR Code** (recommandé) : admin génère depuis /admin/students/[id]/qr
2. **Google OAuth** : email Google enregistré par l'école
3. **Code court** : "STR-2025-042" + PIN 4 chiffres

#### QR Code structure
```json
{
  "student_code": "STR-2025-042",
  "org_id": "str-uuid-xxx",
  "expires_at": "2026-08-31"
}
```

#### Quiz générés par l'enseignant
```json
{
  "id": "quiz-001",
  "organization_id": "str-uuid-xxx",
  "class_id": "6eme-A",
  "subject": "mathematiques",
  "questions": [...],
  "published_at": "2025-05-16",
  "created_by": "teacher-uuid"
}
```

#### App desktop — Étapes
1. Télécharger EduSmart-Desktop-Setup.exe
2. Saisir URL école + email + mot de passe
3. Sync initiale SQLite ← Supabase
4. Utilisation : saisie notes, bulletins, attestations, emplois du temps
5. Sync automatique quand internet revient

```
● Connecté  → sync auto toutes 5 min
● Hors-ligne → SQLite local, 0 perte de données
● Conflit    → dialogue résolution last-write-wins
```

---

## Message 33 — User
Comment acheter le domaine edusmart.mg et le configurer dans Vercel ?

---

## Message 34 — Assistant

### Guide complet domaine + Vercel (5 étapes)

1. **Achat domaine** : madagascar-internet.mg (recommandé) ou Netim, Gandi
2. **Nameservers** → `ns1.vercel-dns.com` + `ns2.vercel-dns.com` (OBLIGATOIRE pour wildcard)
3. **Vercel Dashboard** → Settings → Domains → ajouter `edusmart.mg` puis `*.edusmart.mg`
4. **middleware.ts** : lit `req.headers.get('host')` → extrait slug
5. **Server Component** : `headers().get('x-school-slug')` → query Supabase

```typescript
// middleware.ts
const host = req.headers.get('host')
const slug = host.split('.')[0] // "ecole-a"
requestHeaders.set('x-school-slug', slug)

// app/layout.tsx
const slug = headers().get('x-school-slug')
const { data: school } = await supabase
  .from('organizations')
  .select('*')
  .eq('slug', slug)
  .single()
```

**Timeline** : 5' → NS | 5' → Vercel | 48h propagation | 2' config | 30' code

---

## Message 35 — User
Est-ce que LWS suffit (edusmart.site, offre gratuite) ?

---

## Message 36 — Assistant

**Domaine edusmart.site** ✅ Suffisant (prototype/mémoire)
**Hébergement LWS 1Go PHP/MySQL** ❌ Inutile (on utilise Vercel + Supabase)

**Recommandation** : edusmart.site maintenant → migrer vers edusmart.mg pour déploiement réel dans les écoles malgaches.

---

## Message 37 — User
Comment faire le versioning CI/CD vers edusmart.site

---

## Message 38 — Assistant (voir Message 26 — même réponse complète)

---

## Message 39 — User
Schéma de liaison, nom de chaque dossier et architecture (6 apps)

---

## Message 40 — Assistant

### Monorepo avec 6ème app (test)

```
edusmart/
├── apps/
│   ├── vitrine/   ← Next.js 14 (public)
│   ├── admin/     ← Next.js 14 (protégé)
│   ├── mobile/    ← Expo RN (parents)
│   ├── kids/      ← Expo RN (enfants)
│   ├── desktop/   ← Electron (secrétariat)
│   └── test/      ← Next.js 14 (test.edusmart.site) ← NOUVEAU
└── packages/
    ├── shared/
    └── ui/
```

---

## Message 41 — User
Créer un prompt complet pour créer ce projet (6 apps), ajouter la 6ème app test, commandes d'installation, étapes pour avoir test.edusmart.site

---

## Message 42 — Assistant

### Prompt Monorepo EduSmart (fichier .md généré)

**Fichier** : `prompt_monorepo_edusmart.md`

#### Étape 0 — Prérequis
```bash
node --version   # >= 20
npm install -g pnpm
npm install -g turbo
npm install -g eas-cli
npm install -g expo-cli
```

#### Étape 1 — Structure racine
```bash
mkdir edusmart && cd edusmart
git init && git branch -M main
mkdir -p apps packages .github/workflows
```

#### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] }
  }
}
```

#### Étape 3 — apps/test
```bash
cd apps
pnpm create next-app@14 test \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack
```

##### middleware.ts
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

##### page.tsx (debug)
```tsx
export default function TestPage() {
  const slug = headers().get('x-school-slug') ?? 'inconnu'
  const host = headers().get('x-host') ?? 'inconnu'
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div>
        <div className="text-green-400">● SYSTÈME OPÉRATIONNEL</div>
        <h1>EduSmart Test</h1>
        <p>Host : {host}</p>
        <p>Slug école : {slug}</p>
        <p className="text-green-400">✓ Middleware actif</p>
        <p className="text-green-400">✓ Wildcard DNS OK</p>
      </div>
    </main>
  )
}
```

#### Étape 9 — Vercel
```
Root Directory : apps/test
Build Command  : cd ../.. && pnpm install && pnpm --filter=@edusmart/test build
```

#### Étape 10 — Vérification
```bash
nslookup test.edusmart.site
# Doit retourner : 7c280f9aadf5f882.vercel-dns-017.com ou cname.vercel-dns.com
open https://test.edusmart.site
```

#### Checklist finale
- [ ] pnpm install sans erreur
- [ ] pnpm dev:test → localhost:3005 visible
- [ ] Repo GitHub créé, code poussé
- [ ] DNS LWS configuré (A, CNAME test, CNAME *, TXT _vercel)
- [ ] Projet Vercel créé (Root = apps/test)
- [ ] test.edusmart.site affiche page de debug ✅

---

## Message 43 — User
[Screenshot LWS Zone DNS — Nameservers LWS actifs ns21-ns24.lwsdns.com]

Configuration DNS personnalisée ? Non/Oui — avec 4 nameservers LWS

---

## Message 44 — Assistant

Tu es sur la Zone DNS LWS (nameservers LWS conservés). Ajouter 3 enregistrements DNS :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | test | cname.vercel-dns.com. |
| CNAME | * | cname.vercel-dns.com. |

⚠️ Point obligatoire à la fin des CNAME
⚠️ Mail LWS (mail.edusmart.site) ne fonctionnera plus si wildcard * redirige vers Vercel

---

## Message 45 — User
[Screenshot LWS Zone DNS avancée — champs A, AAAA, CNAME, MX, SPF, TXT, SRV, CAA]

---

## Message 46 — Assistant

3 enregistrements à saisir dans LWS Zone DNS avancée :

**Type A** : Nom=`@`, IPv4=`76.76.21.21`, TTL=30min → Sauvegarder
**Type CNAME** : Nom=`test`, Domaine=`cname.vercel-dns.com.`, TTL=30min → Sauvegarder
**Type CNAME** : Nom=`*`, Domaine=`cname.vercel-dns.com.`, TTL=30min → Sauvegarder

---

## Message 47 — User
Donner les étapes depuis le début pour configurer ce domaine test

---

## Message 48 — Assistant

### Guide complet 4 phases (widget interactif + instructions)

**Phase 1 — LWS DNS (5 min)**
```
A      @        76.76.21.21
CNAME  test     7c280f9aadf5f882.vercel-dns-017.com.
CNAME  *        7c280f9aadf5f882.vercel-dns-017.com.
TXT    _vercel  vc-domain-verify=XXXXX
```

**Phase 2 — GitHub (10 min)**
```bash
mkdir edusmart && cd edusmart
git init && git branch -M main
mkdir -p apps packages .github/workflows
# ... créer pnpm-workspace.yaml, package.json, turbo.json
cd apps && pnpm create next-app@14 test --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
# Modifier package.json : name="@edusmart/test", port=3005
# Créer middleware.ts + page.tsx
cd ../../ && pnpm install && pnpm dev:test
git add . && git commit -m "feat: init monorepo + apps/test"
git remote add origin https://github.com/TON-USERNAME/edusmart.git
git push -u origin main
```

**Phase 3 — Vercel (10 min)**
```
Project Name    : edusmart-test
Root Directory  : apps/test
Framework       : Next.js
Build Command   : cd ../.. && pnpm install && pnpm --filter=@edusmart/test build
```
→ Settings → Domains → ajouter `test.edusmart.site`
→ Copier la clé TXT _vercel affichée

**Phase 4 — Retour LWS + vérification**
```bash
nslookup test.edusmart.site
# Doit retourner : 7c280f9aadf5f882.vercel-dns-017.com
open https://test.edusmart.site
# ✅ Host : test.edusmart.site | Slug : test | Middleware actif
```

---

## Message 49 — User
[Screenshot Vercel Production Deployment ready — edu-smart-test.vercel.app]

---

## Message 50 — Assistant

🎉 Déploiement Ready sur Vercel !

**Étape suivante** : Settings → Domains → "Add Custom Domain" → taper `test.edusmart.site`

Vercel va afficher la clé TXT à copier dans LWS.

Les 4 enregistrements complets pour LWS :
```
A      @        76.76.21.21
CNAME  test     7c280f9aadf5f882.vercel-dns-017.com.
CNAME  *        7c280f9aadf5f882.vercel-dns-017.com.
TXT    _vercel  vc-domain-verify=XXXXX
```

---

## Message 51 — User
Vercel affiche "Invalid Configuration" avec :
```
Type : CNAME
Name : test
Value: 7c280f9aadf5f882.vercel-dns-017.com.
```

---

## Message 52 — Assistant

Vercel donne la nouvelle valeur CNAME. Dans LWS Zone DNS :

| Type | Nom | Valeur |
|---|---|---|
| CNAME | `test` | `7c280f9aadf5f882.vercel-dns-017.com.` |

Vérification :
```bash
nslookup test.edusmart.site
dig test.edusmart.site CNAME
# Doit retourner : 7c280f9aadf5f882.vercel-dns-017.com
```

Quand propagé → Vercel passe automatiquement au ✅ Valid

---

## Message 53 — User
Étapes pour configurer les API et récupérer les clés

Variables nécessaires :
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENROUTER_API_KEY
- NEXT_PUBLIC_ROOT_DOMAIN
- RESEND_API_KEY
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

---

## Message 54 — Assistant

### Guide API Keys — 4 services

#### 1. Supabase (URGENT — maintenant)
```
supabase.com → Start for Free → Continue with GitHub
New Project → Name: edusmart → Region: Southeast Asia (Singapore)
→ Settings → API :
  NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
  SUPABASE_SERVICE_ROLE_KEY = eyJhbGci... (cliquer Reveal)
```

Variables Vercel (4 maintenant) :
```
NEXT_PUBLIC_SUPABASE_URL      → URL Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY → clé anon
SUPABASE_SERVICE_ROLE_KEY     → clé service (serveur seulement)
NEXT_PUBLIC_ROOT_DOMAIN       → edusmart.site
```

Fichier local :
```bash
# apps/test/.env.local (jamais pushé sur GitHub)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
```

#### 2. Email LWS (inclus) + Resend (Phase 2)

**LWS Mail** → pour lire/envoyer manuellement
```
panel.lws.fr → Emails → Créer :
contact@edusmart.site
admin@edusmart.site

IMAP: mail.edusmart.site Port 993 SSL
SMTP: mail.edusmart.site Port 465 SSL
```

**Resend** → pour emails automatiques de l'app
```
resend.com → Sign Up → Add Domain: edusmart.site
Region: Ireland (eu-west-1)
RESEND_API_KEY = re_XXXXXXXXXXXX
```

#### 3. OpenRouter (Phase 3)
```
openrouter.ai → Sign In → Credits (5$ pour commencer)
Keys → Create Key "edusmart-prod"
OPENROUTER_API_KEY = sk-or-XXXXXXXXXXXX
```

#### 4. Twilio SMS (Phase 4)
```
twilio.com → Sign Up (trial ~15$)
TWILIO_ACCOUNT_SID = AC...
TWILIO_AUTH_TOKEN = ...
TWILIO_PHONE_NUMBER = +1...
```
Note : Africa's Talking (africastalking.com) est mieux/moins cher pour Madagascar

---

## Message 55 — User
[Screenshot Outlook IMAP — erreur connexion mail.edusmart.site]
Erreur lors de l'ajout dans Outlook

---

## Message 56 — Assistant

**Cause** : Le wildcard CNAME `*` intercepte `mail.edusmart.site` et le redirige vers Vercel au lieu de LWS.

**Solution** : Ajouter dans LWS Zone DNS :

| Type | Nom | Valeur |
|---|---|---|
| A | `mail` | `213.255.195.65` (IP MAIL LWS) |
| MX | `@` | Priorité: 10, Serveur: `mail.edusmart.site.` |

**Explication DNS** : Un enregistrement explicite `A mail` gagne sur le wildcard `*`. Donc `mail.edusmart.site` → LWS, et tout le reste → Vercel.

Vérification :
```bash
nslookup mail.edusmart.site
# Doit retourner : 213.255.195.65
```

Après sauvegarde et propagation (~30 min) → Outlook → Réessayer

---

## Message 57 — User
[Page Resend "Add domain" — champs Name, Region, options tracking]

---

## Message 58 — Assistant

Remplir la page Resend :

```
Name   : edusmart.site
Region : Ireland (eu-west-1)  ← plus proche de Madagascar
```

Advanced options → laisser par défaut
Enable click tracking → décocher
Enable open tracking → décocher

→ Cliquer "Add"

**Ensuite** : Resend affichera des enregistrements DNS (TXT + MX) à ajouter dans LWS :
```
TXT   resend._domainkey.edusmart.site → p=MII...
MX    send.edusmart.site              → feedback-smtp.eu-west-1.amazonses.com.
TXT   send.edusmart.site              → v=spf1 include:...
```

---

# Annexes

## Variables d'environnement complètes (.env.example)
```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenRouter (IA)
OPENROUTER_API_KEY=sk-or-...

# Domaine
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site

# Email (Resend)
RESEND_API_KEY=re_...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## DNS Records complets LWS Zone DNS
```
Type  Nom      Valeur                                      TTL
─────────────────────────────────────────────────────────────
A     @        76.76.21.21                                 30min
A     mail     213.255.195.65                              30min
CNAME test     7c280f9aadf5f882.vercel-dns-017.com.        30min
CNAME *        7c280f9aadf5f882.vercel-dns-017.com.        30min
MX    @        mail.edusmart.site.  (priorité 10)          30min
TXT   _vercel  vc-domain-verify=XXXXX                      30min
TXT   resend._domainkey  p=MII...                          30min
```

## Schéma URLs complètes
```
edusmart.site              → page accueil plateforme (registre écoles)
edusmart.site/register     → inscription nouvelle école
edusmart.site/admin        → super-admin (Randrianarison Dieu Donné)
test.edusmart.site         → page de debug déploiement ✅ LIVE
strelitzia.edusmart.site   → vitrine STRELITZIA SCHOOL
strelitzia.edusmart.site/login     → connexion unique (tous rôles)
strelitzia.edusmart.site/admin     → admin STRELITZIA
strelitzia.edusmart.site/dashboard → parents & élèves STRELITZIA
uaz.edusmart.site          → vitrine UAZ
uaz.edusmart.site/admin    → admin UAZ
```

## Informations projet
```
Domaine       : edusmart.site (LWS, compte LWS-807771)
Déploiement   : edu-smart-test.vercel.app (Vercel, dieudonne261)
GitHub        : github.com/dieudonne261/EduSmart
Commit        : 7224512 - "chore: add Vercel config for test app"
Email LWS     : contact@edusmart.site, admin@edusmart.site
IMAP/SMTP     : mail.edusmart.site (993/465 SSL)
```

## Stack technologique complète
```
Frontend Web   : Next.js 14 (App Router, TypeScript)
Mobile         : Expo SDK 51 (React Native, EAS Build)
Desktop        : Electron 30 + React + Vite
Backend/DB     : Supabase (PostgreSQL, Auth, RLS, Realtime, Storage, Edge Functions)
IA             : OpenRouter (Claude, GPT-4o, Mistral, Llama)
Email auto     : Resend (3000/mois free)
Email manuel   : LWS Mail (mail.edusmart.site)
SMS            : Twilio / Africa's Talking
Monorepo       : Turborepo + pnpm workspaces
CI/CD          : GitHub Actions + Vercel Deploy + Expo EAS
Hébergement    : Vercel (*.edusmart.site wildcard)
Domaine        : edusmart.site (LWS) → migration edusmart.mg prévue
Design         : Tailwind CSS + Shadcn/ui + Playfair Display + DM Sans
Couleurs       : Vert #1A4D3A + Or #C9A84C + Crème #FAFAF8
```

## Références académiques (Section 8 Mémoire)
```
[1] Duval, E., Sharples, M., & Sutherland, R. (2017). Technology Enhanced Learning. Springer.
[2] Baker, R. S., & Inventado, P. S. (2014). Educational data mining. Springer, New York.
[3] Klašnja-Milićević, A. et al. (2011). E-Learning personalization. Computers & Education, 56(3).
[4] Romero, C., & Ventura, S. (2020). Educational data mining. WIREs Data Mining, 10(3).
[5] Supabase Documentation (2024). https://supabase.com/docs
[6] OpenRouter Documentation (2024). https://openrouter.ai/docs
[7] Vercel Documentation (2024). https://vercel.com/docs
[8] Expo Documentation (2024). https://docs.expo.dev
[9] UNESCO (2023). Rapport mondial de suivi sur l'éducation. UNESCO Publishing.
[10] Koedinger, K. R. et al. (2015). Data mining and education. WIREs Cognitive Science, 6(4).
```

## Fichiers générés durant la session
```
1. Proposition_Memoire_EduSmart.docx  ← proposition mémoire Word complète
2. prompt_vitrine_edusmart.md         ← prompt complet site vitrine Next.js
3. prompt_monorepo_edusmart.md        ← prompt monorepo 6 apps
4. EduSmart_Architecture_Multi_Ecoles.docx ← doc architecture multi-écoles
5. Resume_Presentation_Memoire.docx   ← fiche Q&R présentation (non finalisée)
```
