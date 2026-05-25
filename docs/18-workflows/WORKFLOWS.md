# WORKFLOWS — EduSmart

> Workflows opérationnels (dev, déploiement, support, ajout d'école, support utilisateur).
> Sert de référence pour automatiser ce qui peut l'être et standardiser ce qui ne l'est pas encore.

---

## 1. Workflow de développement quotidien

```mermaid
flowchart LR
    A[Pick task] --> B[Créer branche feature/*]
    B --> C[Coder]
    C --> D[Tester local]
    D --> E{OK ?}
    E -->|Non| C
    E -->|Oui| F[Commit conventional]
    F --> G[Push + PR]
    G --> H[CI verte ?]
    H -->|Non| I[Fix]
    I --> F
    H -->|Oui| J[Self-review]
    J --> K[Merge develop]
    K --> L[Vercel preview deploy auto]
    L --> M[Test preview]
    M --> N{OK ?}
    N -->|Non| C
    N -->|Oui| O[PR develop → main]
    O --> P[Vercel prod deploy auto]
```

### Conventions
- Branches : `feature/<short>`, `fix/<short>`, `chore/<short>`.
- Commits : `feat: add students filter`, `fix(desktop): blank window after build`, `docs: add ADR-008`.
- PR titre = identique au commit principal.
- Max 1 PR ouverte par dev par semaine.

---

## 2. Workflow ajout d'une nouvelle école

```mermaid
flowchart LR
    A[Directeur remplit /inscription] --> B[(school_requests pending)]
    B --> C[Email super_admin]
    C --> D[Super_admin review]
    D --> E{Approuvé ?}
    E -->|Non| F[Email refus]
    E -->|Oui| G[UPDATE school_requests status=approved]
    G --> H[Edge Function on_school_approved]
    H --> I[INSERT organizations]
    H --> J[INSERT auth.users director]
    H --> K[INSERT profiles role=director]
    H --> L[Email Magic Link director]
    L --> M[Director se connecte]
    M --> N[Personnalise: logo, couleurs, programmes]
    N --> O[strelitzia.edusmart.site live]
```

**Temps total cible** : < 24h entre demande et accès direction.

> Edge Function `on_school_approved` à créer en [STEP_14](../../tasks/STEP_14.md).

---

## 3. Workflow déploiement (release)

```mermaid
sequenceDiagram
    participant Dev
    participant GH as GitHub
    participant CI
    participant V as Vercel
    participant U as Users

    Dev->>GH: git push develop
    GH->>CI: trigger
    CI->>CI: lint + type-check + build + tests
    CI->>V: trigger preview
    V->>V: deploy preview
    Dev->>V: test preview URL
    Dev->>GH: PR develop → main
    GH->>CI: re-run CI
    Dev->>GH: merge to main
    GH->>V: trigger prod
    V->>V: deploy prod
    V->>U: edusmart.site updated
```

### Checklist release prod
- [ ] PR mergée dans `main` avec review.
- [ ] CI verte sur `main`.
- [ ] Preview prod URL testée manuellement.
- [ ] Backup Supabase fait (Dashboard → Backups → Create).
- [ ] CHANGELOG.md mis à jour.
- [ ] Tag git `v1.x.y` créé.
- [ ] Smoke test post-deploy (login + 1 fetch DB OK).

### Rollback (si KO post-deploy)
1. Vercel Dashboard → Deployments → previous deploy → "Promote to Production".
2. Si DB migration en cause : appliquer migration inverse via SQL Editor.
3. Communiquer aux utilisateurs (banner ou statusapp).

---

## 4. Workflow incident production

```mermaid
flowchart TD
    A[Alert Sentry/Vercel/utilisateur] --> B{Critique ?}
    B -->|Oui prod down| C[Rollback immédiat]
    B -->|Non| D[Triage]
    C --> E[Post-mortem 24h]
    D --> F[Créer issue GitHub]
    F --> G[Assigner P0/P1/P2]
    G --> H[Fix dans branche fix/*]
    H --> I[Tests reproduisant le bug]
    I --> J[PR + merge urgent]
    E --> K[Documenter dans BUGS_AND_FIXES.md]
    J --> K
```

### Post-mortem template (24h après incident)
- **Date** :
- **Durée downtime** :
- **Impact utilisateurs** :
- **Cause racine** :
- **Détection** : (alerte auto / signal utilisateur)
- **Résolution** :
- **Action préventive** :
- **Ajouté à** : [BUGS_AND_FIXES](../12-bugs/BUGS_AND_FIXES.md)

---

## 5. Workflow saisie de notes (utilisateur enseignant)

```mermaid
flowchart LR
    T[Teacher se connecte] --> A[/admin/grades]
    A --> B[Sélectionne classe + matière + période]
    B --> C[Grille élèves]
    C --> D[Saisit notes]
    D --> E[Server Action recordGrade × N]
    E --> F[RLS check organization_id]
    F --> G[INSERT grades]
    G --> H[Trigger update_student_average]
    H --> I[Realtime push parents]
    I --> J[Notif Expo]
```

**Cas offline** (desktop) :
```
Saisie → SQLite local (pending_sync=true)
       → worker sync 5min → batch upload Supabase
       → INSERT grades → mêmes triggers Realtime
```

---

## 6. Workflow génération IA (admin)

```mermaid
sequenceDiagram
    participant T as Teacher
    participant A as /admin/ai-tools
    participant API as /api/ai/generate
    participant OR as OpenRouter
    participant DB as Supabase

    T->>A: Choisit "Générer leçon : Photosynthèse, 4e"
    A->>API: POST { task: 'lesson', subject: 'SVT', topic: 'Photosynthèse', level: '4e' }
    API->>API: requireRole(['teacher','director'])
    API->>API: requireRateLimit(user_id, 50/day)
    API->>OR: stream chat.completions claude-3-haiku
    OR-->>API: SSE chunks
    API-->>A: stream SSE
    A-->>T: affiche progressivement
    API->>DB: INSERT ai_conversations
```

---

## 7. Workflow sync offline desktop

```mermaid
stateDiagram-v2
    [*] --> Online
    Online --> Offline: connection lost
    Offline --> Online: connection back

    Online --> Online: tick 5min<br/>pull diff + push pending
    Offline --> Offline: tick 5min ignored
    Offline --> Offline: writes go to SQLite pending=true

    state Online {
        [*] --> Idle
        Idle --> Pulling: tick
        Pulling --> Pushing
        Pushing --> Idle
    }
```

**Détails** :
- **Pull** : `SELECT * FROM <table> WHERE updated_at > last_sync_at AND organization_id = ?`
- **Push** : `SELECT * FROM <local_table> WHERE pending_sync = true` → POST Supabase → mark synced.
- **Conflit** : `last-write-wins` sur `updated_at` (timestamp UTC).

---

## 8. Workflow onboarding nouvel utilisateur (parent)

```mermaid
flowchart LR
    P[Parent] --> S[Visite strelitzia.edusmart.site]
    S --> C[Page contact "Inscrire mon enfant"]
    C --> D[Formulaire envoyé]
    D --> E[Email reçu directrice]
    E --> F[Directrice valide en admin]
    F --> G[Crée auth.users parent + profile role=parent]
    G --> H[Email Magic Link parent]
    H --> I[Parent click → /dashboard]
    I --> J[Voit ses enfants + notes]
```

---

## 9. Workflow Claude Code (session)

> Inspiré du `EduSmart_VibeCoding_Guide.md`.

```mermaid
flowchart LR
    A[Choisir 1 STEP unique] --> B[Lire le STEP en entier]
    B --> C[Ouvrir terminal claude]
    C --> D[Copier-coller le STEP comme prompt]
    D --> E[Claude code + propose patch]
    E --> F[Review diff]
    F --> G{OK ?}
    G -->|Non| H[Demander correction]
    H --> E
    G -->|Oui| I[pnpm dev + test manuel]
    I --> J[Commit avec message conventional]
    J --> K[Push + PR ou direct si solo]
    K --> L[Marquer STEP "✅" dans TASKS_GLOBAL]
```

**Règle d'or** : **1 session Claude = 1 STEP = 1 commit**.

---

## 10. Workflow support utilisateur (post-pilote)

| Canal | Usage | SLA cible |
|---|---|---|
| Email `contact@edusmart.site` | Demandes B2B (directeurs prospects) | 24h |
| Email `support@edusmart.site` | Bugs / questions utilisateurs | 48h |
| Discord server (privé pilote) | Échanges directs avec écoles pilotes | 4h en semaine |
| WhatsApp (Madagascar uniquement) | Urgence locale | 2h |

**Tools** :
- **Linear** ou **GitHub Issues** pour tracker tickets.
- **Cal.com** pour réserver session de démo.
- **Loom** pour réponses vidéo (formation rapide).

---

## 11. Workflow scolaire annuel (long terme)

```mermaid
gantt
    title Cycle scolaire EduSmart
    dateFormat YYYY-MM-DD
    section Pré-rentrée
        Import élèves + classes : 2026-08-15, 30d
        Saisie planning + emploi du temps : 2026-09-01, 14d
    section T1
        Saisie notes T1 : 2026-09-15, 90d
        Bulletins T1 : 2026-12-15, 7d
    section T2
        Saisie notes T2 : 2027-01-08, 80d
        Bulletins T2 : 2027-03-30, 7d
    section T3
        Saisie notes T3 : 2027-04-01, 80d
        Bulletins T3 + examens : 2027-06-15, 14d
```

---

## 12. Automatisations recommandées (P3)

| Workflow | Outil | Effort |
|---|---|---|
| Cron détection décrochage hebdo | Supabase Edge Functions | 4h |
| Email récap quotidien parent | Resend + Edge Function | 3h |
| Export CSV bulletins fin de trimestre | Server Action + Supabase Storage | 2h |
| Sync auto Google Calendar (emploi du temps) | API Google + Edge Function | 8h |
| Webhook Stripe abonnement écoles | Route Handler `/api/webhooks/stripe` | 4h |

---

## 13. Liens

- 🗺️ [ROADMAP](../10-roadmap/ROADMAP.md)
- 📋 [TASKS_GLOBAL](../11-tasks/TASKS_GLOBAL.md)
- 🔁 [Workflow de session Claude — VibeCoding Guide](../17-ai-analysis/AI_CONVERSATION_SUMMARY.md)
- 🗂️ [MASTER_INDEX](../MASTER_INDEX.md)
