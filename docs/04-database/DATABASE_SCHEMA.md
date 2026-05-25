# DATABASE SCHEMA — EduSmart

> Schéma PostgreSQL hébergé sur Supabase. 12 tables principales + RLS systématique.
> Référence : [tasks/STEP_01.md](../../tasks/STEP_01.md) pour la création.

---

## 1. Diagramme entité-relation

```mermaid
erDiagram
    organizations ||--o{ profiles : "has"
    organizations ||--o{ programs : "offers"
    organizations ||--o{ news_articles : "publishes"
    organizations ||--o{ students : "manages"
    organizations ||--o{ quizzes : "creates"
    organizations ||--o{ vitrine_settings : "configures"
    organizations ||--o{ team_members : "lists"
    organizations ||--o{ contact_messages : "receives"

    profiles ||--o{ ai_conversations : "starts"
    profiles }o--|| auth_users : "linked"

    students ||--o{ grades : "receives"
    students ||--o{ game_scores : "earns"

    quizzes ||--o{ game_scores : "scored_in"

    school_requests }o--|| organizations : "promoted_to"

    organizations {
        uuid id PK
        text slug UK
        text name
        text tagline
        text logo_url
        jsonb colors
        text city
        text status
    }

    profiles {
        uuid id PK_FK
        uuid organization_id FK
        text role
        text full_name
        text avatar_url
    }

    students {
        uuid id PK
        uuid organization_id FK
        text student_code
        text pin_hash
        text first_name
        text last_name
        text class_id
        text status
        numeric attendance_rate
        numeric average
    }

    grades {
        uuid id PK
        uuid organization_id FK
        uuid student_id FK
        text subject
        numeric value
        numeric max_value
        numeric coefficient
        text period
    }
```

---

## 2. Tables — détail complet

### 2.1 `organizations`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | uuid | PK, default `uuid_generate_v4()` | |
| `slug` | text | UNIQUE, NOT NULL | Identifiant sous-domaine (ex: `strelitzia`) |
| `name` | text | NOT NULL | Nom officiel |
| `tagline` | text |  | Slogan affiché en hero vitrine |
| `logo_url` | text |  | Storage Supabase (`organizations/{id}/logo.png`) |
| `colors` | jsonb | default `{"primary":"#1A4D3A","secondary":"#C9A84C","surface":"#FAFAF8"}` | Theming dynamique |
| `address` | text |  | |
| `phone` | text |  | |
| `email` | text |  | Contact général |
| `city` | text |  | |
| `status` | text | check IN (`active`,`pending`,`suspended`) | |
| `created_at` | timestamptz | default `now()` | |

**Indexes** : `unique(slug)` automatique.
**RLS** : lecture publique (`USING true`), écriture super_admin uniquement.

---

### 2.2 `profiles` — étend `auth.users`

| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| `id` | uuid | PK, FK → `auth.users(id)` ON DELETE CASCADE | Même ID que l'utilisateur Auth |
| `organization_id` | uuid | FK → `organizations(id)` ON DELETE SET NULL | Si NULL = super_admin global |
| `role` | text | NOT NULL, check IN (`super_admin`,`director`,`teacher`,`secretary`,`parent`,`student`) | |
| `full_name` | text |  | |
| `avatar_url` | text |  | |
| `created_at` | timestamptz | default `now()` | |

**Indexes** : `(organization_id)`, `(role)`.
**RLS** : `own_profile_select` (id = auth.uid()), `own_profile_update` (id = auth.uid()).

---

### 2.3 `school_requests` — Demandes d'inscription d'écoles

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `school_name` | text | NOT NULL |
| `slug_wanted` | text | NOT NULL |
| `director_email` | text | NOT NULL |
| `city` | text |  |
| `status` | text | check IN (`pending`,`approved`,`rejected`), default `pending` |
| `created_at` | timestamptz | default now() |

**RLS** :
- `public_create_request` : `INSERT` libre (formulaire vitrine).
- `super_admin_read_requests` : SELECT pour role=`super_admin`.

**Workflow** : `pending` → super_admin approve → Edge Function `on_school_approved` crée orga + envoie email directeur.

---

### 2.4 `programs`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK → organizations, NOT NULL |
| `title` | text | NOT NULL |
| `description` | text |  |
| `level` | text | ex: "Lycée", "Master" |
| `duration` | text | ex: "3 ans" |
| `created_at` | timestamptz | default now() |

**RLS** : lecture publique, écriture par école (`organization_id = current_user_organization_id()`).

---

### 2.5 `news_articles`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK NOT NULL |
| `title` | text | NOT NULL |
| `excerpt` | text |  |
| `body` | text |  | (markdown) |
| `cover_url` | text |  | |
| `published` | boolean | default false |
| `published_at` | timestamptz |  | |
| `created_at` | timestamptz | default now() |

**RLS** : `public_read_news USING (published=true)`, écriture par école.

---

### 2.6 `students`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK NOT NULL |
| `student_code` | text | NOT NULL — affiché ex: "STR-2025-042" |
| `pin_hash` | text |  | bcrypt du PIN 4 chiffres (kids login) |
| `first_name` | text | NOT NULL |
| `last_name` | text | NOT NULL |
| `class_id` | text |  | "6e A", "Terminale S"… |
| `level` | text |  | "Collège", "Lycée"… |
| `status` | text | check IN (`active`,`watch`,`inactive`) |
| `attendance_rate` | numeric |  | 0–100 |
| `average` | numeric |  | moyenne générale courante |
| `created_at` | timestamptz | default now() |

**Constraints** : `UNIQUE(organization_id, student_code)`.
**RLS** : isolation école stricte (lecture + écriture).

---

### 2.7 `grades`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK NOT NULL |
| `student_id` | uuid | FK NOT NULL |
| `subject` | text | NOT NULL |
| `value` | numeric | NOT NULL |
| `max_value` | numeric | default 20 |
| `coefficient` | numeric | default 1 |
| `period` | text |  | ex: "Trimestre 1" |
| `recorded_at` | timestamptz | default now() |

**Indexes** : `(student_id)`, `(organization_id, period)`.

---

### 2.8 `quizzes`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK NOT NULL |
| `title` | text | NOT NULL |
| `subject` | text |  |
| `questions` | jsonb | NOT NULL — voir format ci-dessous |
| `published_at` | timestamptz |  | NULL = brouillon |
| `created_at` | timestamptz | default now() |

**Format `questions` (JSON)** :
```json
[
  {
    "id": "q1",
    "type": "mcq",
    "question": "Quelle est la capitale ?",
    "options": ["Paris", "Lyon", "Marseille"],
    "correct": 0,
    "points": 10
  }
]
```

---

### 2.9 `game_scores` (app kids)

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK NOT NULL |
| `student_id` | uuid | FK NOT NULL |
| `quiz_id` | uuid | FK ON DELETE SET NULL |
| `score` | numeric | NOT NULL |
| `duration_seconds` | integer |  |
| `played_at` | timestamptz | default now() |

---

### 2.10 `ai_conversations`

| Colonne | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `organization_id` | uuid | FK ON DELETE SET NULL |
| `user_id` | uuid | FK → auth.users ON DELETE SET NULL |
| `messages` | jsonb | NOT NULL, default `[]` — voir format |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | default now() |

**Format `messages`** :
```json
[
  { "role": "user",      "content": "Comment fonctionne la photosynthèse ?", "ts": "..." },
  { "role": "assistant", "content": "La photosynthèse...",                    "ts": "..." }
]
```

**RLS** : `own_ai_conv` (`user_id = auth.uid()`).

---

### 2.11 `vitrine_settings` (1-à-1 avec organizations)

| Colonne | Type | Contraintes |
|---|---|---|
| `organization_id` | uuid | PK, FK → organizations ON DELETE CASCADE |
| `tagline` | text |  | override du tagline de l'orga |
| `banner_url` | text |  |  |
| `sections_visible` | jsonb | default `{"about":true,"programs":true,"news":true,"contact":true}` |
| `seo_title` | text |  |  |
| `seo_description` | text |  |  |
| `updated_at` | timestamptz | default now() |

---

### 2.12 `team_members`

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `organization_id` | uuid FK NOT NULL |
| `full_name` | text NOT NULL |
| `role` | text — ex "Directrice", "Prof maths" |
| `bio` | text |
| `avatar_url` | text |
| `created_at` | timestamptz default now() |

---

### 2.13 `contact_messages` (proposée — voir [STEP_05](../../tasks/STEP_05.md))

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `school_slug` | text |
| `name` | text NOT NULL |
| `email` | text NOT NULL |
| `message` | text NOT NULL |
| `created_at` | timestamptz default now() |

---

## 3. Helper SQL

```sql
-- Récupère l'organization_id de l'utilisateur connecté depuis son profile.
-- Utilisé dans toutes les policies "school_isolation".
create or replace function current_user_organization_id() returns uuid as $$
  select organization_id from profiles where id = auth.uid()
$$ language sql stable security definer;
```

---

## 4. Policies RLS — résumé

| Table | Lecture | Écriture |
|---|---|---|
| `organizations` | `public` (USING true) | `super_admin` uniquement |
| `profiles` | `id = auth.uid()` OR `same org` | `id = auth.uid()` |
| `school_requests` | `super_admin` | `public` (INSERT only) |
| `programs` | `public` | `same org` |
| `news_articles` | `published = true` (public), `same org` (drafts) | `same org` |
| `students` | `same org` | `same org` |
| `grades` | `same org` | `same org` |
| `quizzes` | `same org` | `same org` |
| `game_scores` | `same org` | `same org` |
| `ai_conversations` | `user_id = auth.uid()` | `user_id = auth.uid()` |
| `vitrine_settings` | `public` | `same org` |
| `team_members` | `public` | `same org` |
| `contact_messages` | `super_admin` + `same org` | `public` (INSERT only) |

---

## 5. Indexes critiques (performance)

```sql
create index idx_students_org              on students(organization_id);
create index idx_grades_student            on grades(student_id);
create index idx_grades_org_period         on grades(organization_id, period);
create index idx_news_org_published        on news_articles(organization_id, published);
create index idx_quizzes_org_published     on quizzes(organization_id, published_at);
create index idx_game_scores_student       on game_scores(student_id);
create index idx_profiles_org              on profiles(organization_id);
```

---

## 6. Migrations & versionnement

Structure prévue :
```
supabase/
├── migrations/
│   ├── 0001_init.sql            ← tables + indexes
│   ├── 0002_rls.sql              ← policies
│   ├── 0003_contact_messages.sql ← ajout table contact
│   └── 0004_school_requests_flow.sql ← workflow approbation
├── seed.sql                     ← STRELITZIA + UAZ + ~10 élèves
└── functions/
    └── on_school_approved/      ← Edge Function (Deno)
```

Commandes :
```bash
npx supabase migration new <nom>
npx supabase db push           # applique au projet linked
npx supabase db reset          # ⚠️ DROP + replay tout (local only)
npx supabase gen types typescript --linked --schema public > packages/shared/src/supabase/types.ts
```

---

## 7. Storage Buckets

| Bucket | Contenu | Public ? |
|---|---|---|
| `logos` | `<orga_id>/logo.png` | ✅ |
| `avatars` | `<user_id>/avatar.png` | ✅ |
| `news_covers` | `<orga_id>/<news_id>.jpg` | ✅ |
| `bulletins` | `<orga_id>/<student_id>/<period>.pdf` | ❌ — signed URL |
| `imports` | CSV temporaires (élèves, notes) | ❌ — usage server-only |

---

## 8. Realtime channels

| Channel | Trigger | Usage |
|---|---|---|
| `grades:{organization_id}` | INSERT/UPDATE grades | Parents notifiés en temps réel |
| `news:{organization_id}` | INSERT news_articles WHERE published | Push notifications mobile |
| `quizzes:{organization_id}` | UPDATE quizzes WHERE published_at IS NOT NULL | Sync app kids |

---

## 9. Liens

- 🏗️ [ARCHITECTURE](../02-architecture/ARCHITECTURE.md)
- 📌 [tasks/STEP_01](../../tasks/STEP_01.md) — Créer Supabase + tables + RLS
- 🛡️ [SECURITY_REPORT](../14-security/SECURITY_REPORT.md)
