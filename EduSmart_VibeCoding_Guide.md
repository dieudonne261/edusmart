# 🚀 EduSmart — Guide Vibe Coding avec Claude Code / Claude Desktop
## Randrianarison Dieu Donné · Master Informatique UAZ · Mai 2026

---

> **Vibe Coding** = Décrire ce que tu veux en langage naturel → Claude génère le code → tu testes → tu ajustes → tu continues. Pas de code écrit à la main ligne par ligne.

---

## 📋 SOMMAIRE

1. [Prérequis machine à installer](#1-prérequis-machine)
2. [Configuration Claude Code](#2-configuration-claude-code)
3. [Structure des fichiers de contexte](#3-fichiers-de-contexte)
4. [Compétences à maîtriser avant de coder](#4-compétences-à-maîtriser)
5. [Tâches par ordre — du plus urgent](#5-tâches-dans-lordre)
6. [Prompts prêts à l'emploi par module](#6-prompts-prêts)
7. [Workflow vibe coding EduSmart](#7-workflow)
8. [Règles de qualité et validation](#8-règles-de-qualité)
9. [Commandes utiles](#9-commandes-utiles)
10. [Checklist finale](#10-checklist)

---

## 1. PRÉREQUIS MACHINE

### Installer dans cet ordre exact

```bash
# ── Node.js (version 20 LTS) ──────────────────────────────────
# Télécharger sur nodejs.org → LTS version
node --version   # doit afficher v20.x.x
npm --version    # doit afficher 10.x.x

# ── pnpm ─────────────────────────────────────────────────────
npm install -g pnpm
pnpm --version   # doit afficher 9.x.x

# ── Turborepo ────────────────────────────────────────────────
npm install -g turbo
turbo --version  # doit afficher 2.x.x

# ── Git ──────────────────────────────────────────────────────
git --version    # doit afficher 2.x.x
git config --global user.name  "Randrianarison Dieu Donne"
git config --global user.email "ddieu0970@gmail.com"

# ── Expo & EAS (pour apps mobiles) ───────────────────────────
npm install -g expo-cli eas-cli
expo --version
eas --version

# ── Supabase CLI ──────────────────────────────────────────────
npm install -g supabase
supabase --version

# ── Claude Code ───────────────────────────────────────────────
npm install -g @anthropic-ai/claude-code
claude --version

# ── VSCode Extensions recommandées ───────────────────────────
# Installer dans VSCode :
# - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
# - Prisma (prisma.prisma)
# - ESLint (dbaeumer.vscode-eslint)
# - Prettier (esbenp.prettier-vscode)
# - GitLens (eamodio.gitlens)
# - Error Lens (usernamehw.errorlens)
```

### Vérification rapide

```bash
node --version && pnpm --version && turbo --version && git --version && claude --version
# Si tout affiche une version → tu es prêt
```

---

## 2. CONFIGURATION CLAUDE CODE

### Installation et connexion

```bash
# 1. Installer Claude Code globalement
npm install -g @anthropic-ai/claude-code

# 2. Se connecter (ouvre le navigateur)
claude login

# 3. Vérifier la connexion
claude --version

# 4. Ouvrir Claude Code dans le projet EduSmart
cd /chemin/vers/edusmart
claude
# → Interface terminal interactive s'ouvre
```

### Fichier CLAUDE.md à créer à la racine (OBLIGATOIRE)

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il donne le contexte complet du projet.

```markdown
# EduSmart — Contexte Projet pour Claude Code

## Description
Plateforme SaaS multi-établissements scolaires pour Madagascar.
Architecture multi-tenant : chaque école = un sous-domaine (strelitzia.edusmart.site).

## Stack
- Next.js 14 App Router (TypeScript strict)
- Expo SDK 51 React Native
- Electron 30 + React + Vite
- Supabase (PostgreSQL + Auth + RLS + Realtime + Storage)
- OpenRouter API (Claude Haiku, Mistral 7B)
- Turborepo + pnpm workspaces
- Tailwind CSS + Shadcn/ui
- Vercel (wildcard *.edusmart.site)

## Structure monorepo
apps/vitrine  → Next.js 14, port 3001, vitrines écoles + site marketing
apps/admin    → Next.js 14, port 3002, portail admin école
apps/mobile   → Expo, app parents/élèves
apps/kids     → Expo, app enfant gamifiée
apps/desktop  → Electron, secrétariat offline
apps/test     → Next.js 14, port 3005, page de debug LIVE

packages/shared → types, Supabase client, hooks, utils
packages/ui     → design system, tokens

## Règles importantes
- TOUJOURS utiliser TypeScript strict (pas de 'any')
- TOUJOURS filtrer par organization_id dans les requêtes Supabase
- JAMAIS de clé API dans le code (utiliser .env.local)
- TOUJOURS tester en local AVANT de push
- Les couleurs viennent de var(--color-primary) CSS (dynamiques par école)

## Couleurs design
- Vert principal : #1A4D3A
- Or : #C9A84C
- Crème : #FAFAF8

## Variables d'env disponibles
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
OPENROUTER_API_KEY

## Multi-tenant — principe clé
- middleware.ts lit le sous-domaine → extrait le slug
- En local : utiliser ?school=strelitzia dans l'URL
- layout.tsx charge les données de l'école via Supabase

## Commandes utiles
pnpm dev:test     → lance apps/test sur port 3005
pnpm dev:vitrine  → lance apps/vitrine sur port 3001
pnpm dev:admin    → lance apps/admin sur port 3002
pnpm build        → build tout le monorepo
```

### Fichier .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm:*)",
      "Bash(git:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(supabase:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)"
    ]
  },
  "model": "claude-opus-4-5",
  "autoApprove": false
}
```

---

## 3. FICHIERS DE CONTEXTE

> Ces fichiers aident Claude Code à comprendre chaque partie du projet.
> Créer un fichier CLAUDE.md dans chaque app.

### apps/vitrine/CLAUDE.md

```markdown
# apps/vitrine — Site vitrine + site marketing

## Rôle
- edusmart.site → site marketing (slug = "__root__")
- *.edusmart.site → vitrine de chaque école

## Architecture pages
(root)/page.tsx    → landing EduSmart (directeurs)
(school)/page.tsx  → vitrine école (familles)
middleware.ts      → lit sous-domaine, injecte x-school-slug

## Test local
localhost:3001?school=strelitzia → vitrine STRELITZIA
localhost:3001?school=uaz        → vitrine UAZ
localhost:3001                   → site marketing EduSmart

## Données
- Viennent de Supabase (table organizations, programs, news_articles)
- Pas de mock data en production
- RLS : tout le monde peut lire (vitrine publique)
```

### apps/admin/CLAUDE.md

```markdown
# apps/admin — Portail administration école

## Rôle
Interface pour : directeur, enseignant, secrétariat, comptabilité

## Protection
middleware.ts vérifie JWT Supabase à chaque requête
Rôles : director > teacher > secretary > accountant

## Routes importantes
/admin/dashboard      → KPI école
/admin/students       → gestion élèves
/admin/grades         → notes et bulletins
/admin/staff          → personnel
/admin/ai-tools       → génération IA (leçons, quiz, appréciations)
/admin/settings       → config vitrine (logo, couleurs, programmes)
```

### packages/shared/CLAUDE.md

```markdown
# packages/shared — Code partagé

## Règles
- Ce package est importé par TOUTES les apps
- Modifier ici = modifier partout
- Toujours exporter depuis src/index.ts

## Fichiers clés
supabase/client.ts  → createClient() pour le browser
supabase/server.ts  → createServerSupabase() pour Server Components
types/organization.ts → type Organization
utils/gradeCalc.ts  → calcul moyennes (NE PAS DUPLIQUER ailleurs)
```

---

## 4. COMPÉTENCES À MAÎTRISER

> Avant de coder, tu dois comprendre ces concepts.
> Pas besoin d'être expert — comprendre suffit pour guider Claude Code.

### 4.1 Next.js 14 App Router

```
Ce que tu dois comprendre :
✓ Server Components vs Client Components ('use client')
✓ Layout.tsx = structure partagée d'un groupe de pages
✓ page.tsx = contenu d'une page
✓ route.ts = API endpoint (POST, GET)
✓ middleware.ts = s'exécute AVANT chaque page
✓ Server Actions = fonctions serveur appelées depuis le client
✓ notFound() = afficher page 404
✓ redirect() = rediriger vers une autre page
✓ headers() = lire les headers HTTP côté serveur
✓ revalidatePath() = vider le cache d'une page

Ce que tu n'as PAS besoin de connaître :
✗ Les internals de webpack/rspack
✗ La config avancée de next.config.ts
✗ Les optimisations de bundle
```

### 4.2 Supabase

```
Ce que tu dois comprendre :
✓ .from('table').select('*') = lire des données
✓ .insert({...}) = créer une ligne
✓ .update({...}).eq('id', id) = modifier une ligne
✓ .eq('organization_id', orgId) = filtrer par école
✓ Row-Level Security (RLS) = sécurité automatique par utilisateur
✓ supabase.auth.signInWithPassword() = connexion
✓ supabase.auth.getUser() = utilisateur connecté
✓ storage.from('bucket').upload() = uploader un fichier
✓ .subscribe() = écouter les changements en temps réel

Ce que tu n'as PAS besoin de connaître :
✗ La config avancée de PostgreSQL
✗ Les indexes et optimisations SQL
✗ Les migrations complexes
```

### 4.3 OpenRouter

```
Ce que tu dois comprendre :
✓ fetch('https://openrouter.ai/api/v1/chat/completions', {...})
✓ model: 'anthropic/claude-3-haiku' ou 'mistralai/mistral-7b-instruct'
✓ stream: true = réponse en temps réel (effet machine à écrire)
✓ messages: [{role: 'system', content: '...'}, {role: 'user', content: '...'}]
✓ max_tokens: limite la longueur de la réponse
✓ response_format: {type: 'json_object'} = forcer le JSON

Modèles à utiliser par tâche :
- Chat basique vitrine    → mistralai/mistral-7b-instruct (gratuit)
- Génération leçons       → anthropic/claude-3-haiku (rapide)
- Analyse complexe        → anthropic/claude-3-5-sonnet (précis)
- Quiz JSON structuré     → mistralai/mistral-7b-instruct (économique)
```

### 4.4 Expo + React Native

```
Ce que tu dois comprendre :
✓ Expo Router = même logique que Next.js App Router mais mobile
✓ useEffect + useState = état local d'un écran
✓ AsyncStorage / MMKV = stockage local persistant
✓ expo-notifications = notifications push
✓ EAS Build = compiler l'APK dans le cloud

Ce que tu n'as PAS besoin de connaître :
✗ La config native (iOS/Android Xcode/Android Studio)
✗ Les modules natifs C++
```

---

## 5. TÂCHES DANS L'ORDRE

> Suivre cet ordre exactement. Ne pas sauter d'étape.

### 🔴 URGENT — À faire cette semaine

| Priorité | Tâche | App | Durée estimée |
|---|---|---|---|
| 1 | Récupérer clés Supabase + Vercel env vars | Config | 20 min |
| 2 | Créer tables SQL dans Supabase | Supabase | 30 min |
| 3 | Créer packages/shared (client Supabase + types) | Shared | 30 min |
| 4 | Middleware complet apps/test (multi-tenant) | Test | 20 min |
| 5 | Tester `?school=strelitzia` en local | Test | 10 min |
| 6 | Push + vérifier test.edusmart.site | Vercel | 15 min |

### 🟠 SEMAINE 2 — Vitrine école

| Priorité | Tâche | App | Durée estimée |
|---|---|---|---|
| 7 | Créer apps/vitrine squelette | Vitrine | 1h |
| 8 | Layout.tsx — charge données Supabase | Vitrine | 1h |
| 9 | Page d'accueil avec vraies données | Vitrine | 2h |
| 10 | Pages about, programs, news, contact | Vitrine | 3h |
| 11 | Composant ChatWidget (IA + localStorage) | Vitrine | 2h |
| 12 | Route /api/chat (OpenRouter streaming) | Vitrine | 1h |
| 13 | Déployer strelitzia.edusmart.site | Vercel | 30 min |

### 🟡 SEMAINE 3 — Admin + Login

| Priorité | Tâche | App | Durée estimée |
|---|---|---|---|
| 14 | Créer apps/admin squelette | Admin | 1h |
| 15 | Page login + Server Action + Supabase Auth | Admin | 2h |
| 16 | Middleware protection routes | Admin | 1h |
| 17 | Dashboard KPI | Admin | 2h |
| 18 | Page élèves (liste + inscription) | Admin | 3h |
| 19 | Page notes (saisie + calcul moyennes) | Admin | 3h |
| 20 | Page settings/vitrine (modifier logo, couleurs) | Admin | 2h |

### 🟢 SEMAINE 4 — IA + Mobile

| Priorité | Tâche | App | Durée estimée |
|---|---|---|---|
| 21 | Route /api/ai/generate (leçons + quiz) | Admin | 2h |
| 22 | Page /admin/ai-tools | Admin | 3h |
| 23 | Génération bulletins PDF | Admin | 3h |
| 24 | Créer apps/mobile squelette | Mobile | 1h |
| 25 | Écran login + tabs | Mobile | 2h |
| 26 | Écran notes + graphiques | Mobile | 3h |
| 27 | Notifications push Supabase Realtime | Mobile | 2h |

### 🔵 SEMAINE 5 — Kids + Desktop

| Priorité | Tâche | App | Durée estimée |
|---|---|---|---|
| 28 | Créer apps/kids squelette | Kids | 1h |
| 29 | Écran connexion (QR + code) | Kids | 2h |
| 30 | Mini-jeux QCM + DragDrop | Kids | 4h |
| 31 | Synchronisation quiz admin → kids | Kids | 2h |
| 32 | Créer apps/desktop squelette | Desktop | 1h |
| 33 | Login + sync SQLite initial | Desktop | 3h |
| 34 | Saisie notes en grille | Desktop | 3h |
| 35 | Impression bulletins PDF | Desktop | 2h |

---

## 6. PROMPTS PRÊTS À L'EMPLOI

> Copie-colle ces prompts directement dans Claude Code.
> Les `[ENTRE CROCHETS]` sont à remplacer par tes valeurs.

### Prompt 1 — Créer les tables Supabase

```
Dans Supabase SQL Editor, génère le script SQL complet pour créer les tables
du système EduSmart multi-tenant.

Tables nécessaires :
- organizations (id, slug, name, tagline, logo_url, colors JSONB, address, phone, email, city, status, created_at)
- school_requests (id, school_name, slug_wanted, director_email, city, status, created_at)
- profiles (id→auth.users, organization_id→organizations, role, full_name, avatar_url)
- programs (id, organization_id, title, level, description, color)
- news_articles (id, organization_id, title, excerpt, content, category, published, published_at)
- students (id, organization_id, first_name, last_name, class_id, student_code, pin_hash, birth_date)
- grades (id, organization_id, student_id, subject, value, max_value, period, created_by)
- quizzes (id, organization_id, class_id, subject, questions JSONB, published_at, created_by)
- game_scores (id, organization_id, student_id, subject, level, score, played_at)
- ai_conversations (id, user_id, organization_id, messages JSONB, created_at)

Activer RLS sur toutes les tables avec les bonnes politiques :
- organizations : lecture publique (pour vitrine sans login)
- programs, news_articles : lecture publique si published=true
- students, grades : lecture/écriture filtrée par organization_id
- profiles : chaque user ne voit que son propre profil

Insérer des données de test pour STRELITZIA et UAZ.
```

### Prompt 2 — Middleware multi-tenant complet

```
Dans apps/vitrine/middleware.ts, crée le middleware Next.js 14 complet qui :

1. En local (host contient 'localhost') :
   - Lit le paramètre ?school= dans l'URL
   - Si ?school=strelitzia → x-school-slug = 'strelitzia'
   - Si pas de paramètre → x-school-slug = '__root__'

2. En production :
   - Si host = 'edusmart.site' ou 'www.edusmart.site' → x-school-slug = '__root__'
   - Si host = 'strelitzia.edusmart.site' → x-school-slug = 'strelitzia'
   - Si host = 'uaz.edusmart.site' → x-school-slug = 'uaz'

3. Injecte aussi :
   - x-org-id (récupéré depuis Supabase en cherchant par slug)
   - x-host (le host complet)

4. Protège les routes /admin et /dashboard :
   - Vérifie qu'un cookie de session Supabase existe
   - Sinon redirect vers /login

Variables d'env : NEXT_PUBLIC_ROOT_DOMAIN, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

Stack : Next.js 14, @supabase/ssr
```

### Prompt 3 — Layout vitrine école dynamique

```
Dans apps/vitrine/src/app/(school)/layout.tsx, crée le layout Server Component qui :

1. Lit x-school-slug depuis les headers
2. Si slug === '__root__' → affiche <RootLayout> (composant vide à créer)
3. Sinon → requête Supabase :
   SELECT id, slug, name, tagline, logo_url, colors, address, phone, email, city
   FROM organizations WHERE slug = [slug] AND status = 'active'
4. Si école introuvable → notFound()
5. Injecte les couleurs de l'école via CSS variables :
   --color-primary: school.colors.primary
   --color-secondary: school.colors.secondary
6. Affiche <SchoolNavbar school={school}> et <SchoolFooter school={school}>

Navbar affiche : logo_url de l'école (ou initiales si null), nom de l'école, liens navigation
Footer affiche : adresse, téléphone, email, copyright avec nom de l'école

Utilise Tailwind avec bg-[var(--color-primary)] pour les couleurs dynamiques.
Stack : Next.js 14, @edusmart/shared (createServerSupabase), TypeScript
```

### Prompt 4 — Page d'accueil vitrine école

```
Dans apps/vitrine/src/app/(school)/page.tsx, crée la page d'accueil de la vitrine
d'une école avec ces sections dans l'ordre :

1. HeroSection : titre de l'école, tagline, bouton "Inscrire mon enfant" → /contact
2. StatsSection : 4 chiffres clés (stats depuis Supabase organizations)
3. ProgramsSection : liste des filières (depuis table programs filtrée par org_id)
4. NewsSection : 3 dernières actualités publiées (depuis table news_articles)
5. CTASection : bannière "Rejoignez-nous" + bouton formulaire

Chaque section est un composant React séparé dans src/components/school/
Les données viennent de Supabase (Server Component, pas useEffect)
Les couleurs utilisent var(--color-primary) et var(--color-secondary)
Design : Tailwind CSS, cartes arrondies, ombres légères, animations Framer Motion

Créer aussi un composant Skeleton loading pour chaque section.
```

### Prompt 5 — Chat IA flottant

```
Crée un composant ChatWidget pour apps/vitrine avec ces fonctionnalités :

Composant : src/components/ChatWidget.tsx (Client Component)

1. BOUTON : cercle fixe bottom-6 right-6, couleur var(--color-primary), icône 💬
   - Au clic : ouvre/ferme la fenêtre de chat

2. FENÊTRE CHAT (300x400px, fixe bottom-24 right-6, shadow-xl, rounded-2xl) :
   - Header : "Assistant [nom école]" + bouton fermer
   - Corps : liste des messages (user en vert à droite, assistant en gris à gauche)
   - Effet streaming : le texte apparaît lettre par lettre
   - Input : champ texte + bouton envoyer

3. STOCKAGE :
   - Si user = null → localStorage key 'edusmart_chat_[slug]'
   - Si user connecté → Supabase table ai_conversations
   - Charger l'historique au montage du composant

4. APPEL API :
   - POST /api/chat avec { messages: [...], slug: string }
   - Lire le stream avec ReadableStream + TextDecoder
   - Afficher chaque chunk reçu immédiatement

5. MESSAGE DE BIENVENUE automatique au premier message :
   "Bonjour ! Je suis l'assistant de [nom école]. Comment puis-je vous aider ?"

Props : { school: { name, slug, city }, user: User | null }
```

### Prompt 6 — Route API chat OpenRouter

```
Crée la route API apps/vitrine/src/app/api/chat/route.ts :

1. Méthode : POST
2. Body reçu : { messages: [{role, content}][], slug: string }
3. Charger les infos de l'école depuis Supabase (nom, ville, programmes)
4. Construire le system prompt contextualisé :
   "Tu es l'assistant de {school.name}, école à {school.city}, Madagascar.
    Tu aides les visiteurs à découvrir l'école et ses programmes : {programs.map(p => p.title).join(', ')}.
    Réponds toujours en français. Sois bienveillant, concis (max 3 phrases par réponse)."

5. Appeler OpenRouter avec streaming :
   URL : https://openrouter.ai/api/v1/chat/completions
   Model : mistralai/mistral-7b-instruct
   max_tokens : 300 (pour limiter les coûts)
   stream : true

6. Retourner le stream directement avec Content-Type: text/event-stream

Gestion erreurs :
- Si OPENROUTER_API_KEY manquante → 500 avec message clair
- Si école introuvable → 404
- Rate limiting : max 10 messages par IP par heure (utiliser un simple compteur en mémoire)

Variables d'env : OPENROUTER_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Prompt 7 — Login + Auth complet

```
Dans apps/vitrine/src/app/(school)/(auth)/login/, crée le système de login complet :

1. page.tsx : formulaire email + mot de passe
   - Logo de l'école en haut (var(--color-primary) en background)
   - Champ email + mot de passe
   - Bouton "Se connecter" (couleur primaire de l'école)
   - Lien "Mot de passe oublié ?"
   - Message d'erreur si identifiants incorrects

2. actions.ts : Server Action 'use server'
   - Appeler supabase.auth.signInWithPassword()
   - Lire role et organization_id depuis user.user_metadata
   - Comparer organization_id avec l'org du sous-domaine (depuis header x-org-id)
   - Si mauvaise école → error: "Ce compte n'appartient pas à cette école"
   - Redirection :
     director  → /admin/dashboard
     teacher   → /admin/grades
     secretary → /admin/students
     parent    → /dashboard
     student   → /dashboard/student

3. Mise à jour middleware.ts :
   - Protéger /admin/* et /dashboard/* avec vérification session Supabase
   - Rediriger vers /login si pas de session
   - Rediriger teacher hors de /admin/students vers /admin/grades

Stack : Next.js 14 Server Actions, @supabase/ssr, TypeScript
```

### Prompt 8 — Admin AI Tools

```
Dans apps/vitrine/src/app/(school)/(dashboard)/admin/ai-tools/, crée la page des outils IA :

1. INTERFACE PRINCIPALE :
   Tabs : "Leçons" | "Quiz" | "Appréciations" | "Analyse classe"

2. ONGLET LEÇONS :
   - Form : matière (select), niveau (select classes), thème (texte), durée (slider 30-90 min)
   - Bouton "Générer le cours"
   - Zone résultat : affiche le cours généré en streaming (Markdown rendu)
   - Boutons : Copier | Exporter PDF | Sauvegarder

3. ONGLET QUIZ :
   - Form : matière, classe, nombre questions (5/10/15/20), difficulté
   - Bouton "Générer le quiz"
   - Preview des questions générées
   - Bouton "Publier dans l'app kids" → INSERT dans table quizzes

4. ONGLET APPRÉCIATIONS :
   - Sélectionner un élève (liste depuis Supabase)
   - Données auto-remplies : moyenne, absences
   - Bouton "Générer 3 appréciations"
   - 3 cartes avec version courte, moyenne, longue
   - Clic pour sélectionner celle à utiliser dans le bulletin

5. ROUTE API /api/ai/generate :
   - Vérifier que l'user est director ou teacher
   - Types : 'lesson' | 'quiz' | 'appreciation'
   - Modèles : claude-3-haiku pour lesson/appreciation, mistral pour quiz JSON
   - quiz → response_format: json_object pour garantir le JSON
   - Streaming pour lesson et appreciation

Accès : uniquement director et teacher (vérifier dans Server Action)
```

### Prompt 9 — App mobile squelette

```
Dans apps/mobile/, crée le squelette de l'app Expo pour parents et élèves :

1. STRUCTURE Expo Router :
   app/
   ├── _layout.tsx      ← check session au démarrage, redirect si pas connecté
   ├── (auth)/
   │   ├── login.tsx    ← email + mot de passe, theming dynamique par école
   │   └── onboarding.tsx ← 3 slides, stocke flag AsyncStorage
   └── (tabs)/
       ├── _layout.tsx  ← TabBar avec 4 onglets : Accueil, Notes, Messages, Profil
       ├── index.tsx    ← résumé notes + présences du jour
       ├── grades/
       │   ├── index.tsx        ← toutes les matières avec moyenne
       │   └── [subject].tsx    ← graphique évolution (Recharts ou Victory Native)
       ├── messages/
       │   └── index.tsx        ← liste conversations avec enseignants
       └── profile/
           └── index.tsx        ← infos famille + paiement scolarité

2. _layout.tsx principal :
   - Vérifier session Supabase au démarrage
   - Si connecté → charger données école (logo, couleurs) depuis Supabase
   - Appliquer le theming de l'école (custom colors pour la TabBar)
   - Si pas connecté → redirect (auth)/login

3. login.tsx :
   - Champ email + mot de passe
   - Supabase signInWithPassword
   - Charger infos école selon organization_id du user
   - Stocker school dans MMKV pour accès offline

4. index.tsx (accueil) :
   - Message "Bonjour [prénom] !"
   - Card résumé : dernière note + prochains cours
   - Liste absences récentes
   - Bouton vers bulletin PDF (Supabase Storage)

Stack : Expo SDK 51, Expo Router, @supabase/supabase-js, MMKV, TypeScript
```

### Prompt 10 — Desktop Electron squelette

```
Dans apps/desktop/, crée le squelette de l'app Electron pour le secrétariat :

1. STRUCTURE :
   electron/
   ├── main.ts         ← BrowserWindow, IPC handlers
   ├── preload.ts      ← expose window.api au renderer
   ├── db.ts           ← better-sqlite3, schéma SQLite
   └── sync.ts         ← sync bidirectionnel avec Supabase

   src/ (React + Vite)
   ├── App.tsx
   ├── pages/
   │   ├── Login.tsx         ← email + mdp + URL école
   │   ├── Dashboard.tsx     ← statut sync + stats rapides
   │   ├── Students.tsx      ← liste élèves avec recherche
   │   ├── GradeEntry.tsx    ← grille Excel-like (react-spreadsheet)
   │   ├── Bulletins.tsx     ← génération + impression PDF
   │   └── Sync.tsx          ← statut + bouton sync manuelle

2. main.ts :
   - Créer BrowserWindow (1200x800, frame true)
   - IPC : 'db:query', 'db:insert', 'sync:start', 'print:pdf'
   - Vérifier connexion internet toutes les 30 secondes

3. db.ts (SQLite) :
   - Tables miroir de Supabase : organizations, students, grades, programs
   - Colonne supplémentaire 'synced_at' et 'pending_sync' BOOLEAN
   - Méthodes : getAll(table), insert(table, data), update(table, id, data)

4. sync.ts :
   - Pull depuis Supabase → SQLite (à l'ouverture + toutes les 5 min)
   - Push SQLite → Supabase (lignes où pending_sync = true)
   - Stratégie conflits : last-write-wins (comparer updated_at)
   - Émettre événements IPC pour mettre à jour l'UI

5. Login.tsx :
   - Champs : URL école (ex: strelitzia), email, mot de passe
   - Stocker credentials chiffrés avec electron-store
   - Au relancement : utiliser credentials stockés (pas de re-login)

Stack : Electron 30, React 18, Vite 5, better-sqlite3, electron-store, TypeScript
```

---

## 7. WORKFLOW VIBE CODING

### Comment utiliser Claude Code efficacement

```bash
# 1. Ouvrir le terminal dans le dossier racine EduSmart
cd /chemin/vers/edusmart

# 2. Lancer Claude Code
claude

# 3. Pour une tâche spécifique, copier le prompt préparé
# → Exemples : Prompt 1 pour les tables SQL, Prompt 2 pour le middleware

# 4. Claude Code va :
#    - Lire le CLAUDE.md pour le contexte
#    - Générer les fichiers
#    - Demander confirmation avant de modifier
#    - Expliquer ce qu'il a fait

# 5. Toi, tu dois :
#    - Lire le code généré (pas le copier sans lire)
#    - Tester immédiatement (pnpm dev:vitrine)
#    - Signaler les erreurs à Claude Code
#    - Valider avant de push
```

### Session type Claude Code — 1 tâche

```
[Toi] : "Je veux créer le middleware multi-tenant pour apps/vitrine. 
Voici les specs : [coller Prompt 2]"

[Claude Code] : Génère le fichier middleware.ts

[Toi] : Lance le serveur → pnpm dev:vitrine
        Teste localhost:3001?school=strelitzia
        → Si ✅ OK : "Super, ça marche. Maintenant fais [tâche suivante]"
        → Si ❌ Erreur : copier l'erreur console → "J'ai cette erreur : [erreur]"

[Claude Code] : Analyse et corrige

[Toi] : Reteste → OK → commit git
```

### Règle des sessions Claude Code

```
Une session = une tâche = un commit

❌ MAUVAIS : "Fais toute la vitrine + le login + l'admin en une fois"
✅ BON     : "Fais uniquement le middleware.ts. Test. Commit. Ensuite le layout.tsx."

❌ MAUVAIS : Accepter le code sans lire
✅ BON     : Lire les fichiers générés, comprendre la logique, tester

❌ MAUVAIS : Push sans tester
✅ BON     : Tester local → push → vérifier Vercel → push validé
```

---

## 8. RÈGLES DE QUALITÉ

### Format des commits Git

```bash
# Structure : type: description courte (max 72 chars)

git commit -m "feat: add multi-tenant middleware with ?school= local support"
git commit -m "feat: add Supabase tables with RLS policies"
git commit -m "feat: add ChatWidget with OpenRouter streaming"
git commit -m "fix: correct organization_id filter in grades query"
git commit -m "test: validate strelitzia.edusmart.site deployment"
git commit -m "chore: update .env.example with OPENROUTER_API_KEY"

# Types :
# feat    = nouvelle fonctionnalité
# fix     = correction de bug
# test    = validation d'une fonctionnalité
# chore   = maintenance (config, deps)
# docs    = documentation
# refactor= réécriture sans changer le comportement
```

### Checklist avant chaque commit

```
□ Code compile sans erreur TypeScript (pnpm type-check)
□ Aucun 'any' TypeScript dans le code
□ Toutes les requêtes Supabase filtrent par organization_id
□ Aucune clé API en dur dans le code
□ Testé en local (localhost:3001)
□ Console browser propre (aucune erreur rouge)
□ Network tab → réponses 200 (pas de 500)
```

### Checklist après chaque déploiement Vercel

```
□ Vercel build → vert (pas d'erreur de build)
□ Vercel logs → aucune erreur runtime
□ test.edusmart.site accessible
□ strelitzia.edusmart.site affiche les bonnes données
□ uaz.edusmart.site affiche des données différentes
□ Chat IA répond (si OpenRouter configuré)
```

---

## 9. COMMANDES UTILES

### Développement quotidien

```bash
# Lancer l'app de test (la plus simple)
pnpm dev:test
# → http://localhost:3005

# Lancer la vitrine
pnpm dev:vitrine
# → http://localhost:3001
# → http://localhost:3001?school=strelitzia (simuler école)
# → http://localhost:3001?school=uaz (simuler autre école)

# Lancer l'admin
pnpm dev:admin
# → http://localhost:3002

# Builder tout pour vérifier
pnpm build

# Vérifier les types TypeScript
pnpm type-check

# Linter
pnpm lint
```

### Supabase

```bash
# Générer les types TypeScript depuis le schéma Supabase
supabase gen types typescript \
  --project-id [TON_PROJECT_ID] \
  > packages/shared/src/supabase/database.types.ts

# Voir les logs de la base en temps réel
supabase logs --project-ref [TON_PROJECT_ID]
```

### Git — workflow quotidien

```bash
# Créer une branche pour une nouvelle fonctionnalité
git checkout -b feat/chat-widget

# Après test validé
git add .
git commit -m "feat: add ChatWidget with localStorage for anonymous users"
git push origin feat/chat-widget

# Merge dans main
git checkout main
git merge feat/chat-widget
git push origin main
# → Vercel déploie automatiquement
```

### Debug DNS

```bash
# Vérifier propagation DNS
nslookup test.edusmart.site
nslookup strelitzia.edusmart.site
nslookup mail.edusmart.site

# Vérifier depuis le terminal (Mac/Linux)
dig test.edusmart.site CNAME
dig mail.edusmart.site A
```

### Claude Code — commandes spéciales

```bash
# Lancer Claude Code en mode interactif
claude

# Demander une explication d'un fichier
claude explain src/app/middleware.ts

# Demander de corriger un fichier avec une erreur
claude fix src/app/api/chat/route.ts

# Demander une review du code
claude review apps/vitrine/src/app/

# Générer des tests pour un fichier
claude test packages/shared/src/utils/gradeCalc.ts
```

---

## 10. CHECKLIST FINALE

### Avant de commencer à coder

```
□ Node 20 installé
□ pnpm 9 installé
□ Turborepo installé
□ Claude Code installé et connecté (claude login)
□ VSCode avec extensions recommandées
□ Fichier CLAUDE.md créé à la racine du projet
□ .env.local créé avec les 4 variables Supabase + ROOT_DOMAIN
□ test.edusmart.site accessible en ligne
□ Supabase projet créé (Singapore)
□ GitHub repo existant (github.com/dieudonne261/EduSmart)
```

### Progrès du projet

```
□ Phase 0 — Clés .env récupérées + Vercel configuré
□ Phase 1 — Tables Supabase créées + données test insérées
□ Phase 2 — packages/shared : client Supabase + types
□ Phase 3 — Middleware multi-tenant validé en local
□ Phase 4 — Vitrine école : layout + page accueil avec vraies données
□ Phase 5 — Login + Auth + redirection par rôle
□ Phase 6 — Admin : dashboard + élèves + notes
□ Phase 7 — Chat IA : widget flottant + route OpenRouter streaming
□ Phase 8 — Outils IA admin : leçons + quiz + appréciations
□ Phase 9 — App mobile : login + tabs + notes
□ Phase 10 — App kids : QR login + mini-jeux
□ Phase 11 — Desktop : offline + sync SQLite
□ Phase 12 — Déploiement complet toutes écoles
```

---

## ANNEXE — Ressources rapides

| Ressource | URL |
|---|---|
| Claude Code docs | https://docs.anthropic.com/claude-code |
| Next.js 14 App Router | https://nextjs.org/docs/app |
| Supabase JS client | https://supabase.com/docs/reference/javascript |
| OpenRouter API | https://openrouter.ai/docs |
| Expo Router | https://docs.expo.dev/router/introduction |
| Turborepo docs | https://turbo.build/repo/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| Shadcn/ui | https://ui.shadcn.com |
| dnschecker.org | https://dnschecker.org |
| Vercel dashboard | https://vercel.com/dieudonne261s-projects |
| Supabase dashboard | https://supabase.com/dashboard |
| LWS Panel | https://panel.lws.fr |
| GitHub EduSmart | https://github.com/dieudonne261/EduSmart |
| test.edusmart.site | https://test.edusmart.site |

---

*Guide Vibe Coding EduSmart — Randrianarison Dieu Donné — Master Informatique UAZ — Mai 2026*
*Mis à jour après chaque phase complétée*
