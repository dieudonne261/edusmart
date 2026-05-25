# API REFERENCE — EduSmart

> Référence des endpoints HTTP et Server Actions exposés par les apps web (admin, vitrine).
> Convention : **Server Actions par défaut** pour les mutations, **Route Handlers** uniquement quand requis (streaming, webhooks, intégrations externes).

---

## 1. Conventions

| Pattern | Quand l'utiliser |
|---|---|
| Server Action (`'use server'`) | Mutations classiques (formulaires, CRUD) |
| Route Handler `app/api/.../route.ts` | Streaming SSE, webhooks (Stripe, Supabase), endpoints consommés par mobile/desktop |
| Server Component fetch direct | Lecture de données (SSR/RSC) |

---

## 2. Endpoints — `apps/vitrine`

### `POST /api/contact`
Envoie un message via le formulaire de contact.

**Body** (`multipart/form-data` ou `application/x-www-form-urlencoded`)
```
name:    string (required)
email:   string (required, email)
message: string (required)
```

**Réponse** : `303 See Other` → `/contact?sent=1` (ou `?error=...`)

**Side effects** :
- INSERT dans `contact_messages` (service role).
- Envoi email via Resend → `contact@edusmart.site` ou directeur de l'école.

**Rate limit** : 5 messages / IP / heure (P3).

**Status** : 🟡 stub existant — à étendre lors de [STEP_05](../../tasks/STEP_05.md).

---

### Server Action `submitSchoolRequest` (route `/inscription`)
Inscription B2B d'une école.

**Args** (FormData) :
```
school_name:    string
slug_wanted:    string
director_email: string
city:           string
```

**Side effects** :
- INSERT dans `school_requests` (status `pending`).
- Email Resend au super_admin pour validation.
- Redirect `/inscription/merci`.

**Status** : 🔴 à créer ([STEP_05](../../tasks/STEP_05.md)).

---

## 3. Endpoints — `apps/admin`

### `POST /api/ai/generate`
Génération IA (leçons, quiz, appréciations, analyses).

**Headers** : `Authorization` cookie session Supabase (auth requise).

**Body JSON** :
```ts
{
  task: 'lesson' | 'quiz' | 'appraisal' | 'analysis' | 'parent_comm' | 'risk',
  subject?: string,
  level?: string,
  context?: Record<string, any>,
  count?: number,        // pour quiz, appraisal
  stream?: boolean,      // default true
}
```

**Réponse** :
- Si `stream=true` : `text/event-stream` (SSE).
- Sinon : `application/json` `{ result: string | object }`.

**Modèle utilisé selon `task`** :
| task | modèle |
|---|---|
| `lesson` | `anthropic/claude-3-haiku` |
| `quiz` | `mistralai/mistral-7b-instruct` + `response_format: {type:'json_object'}` |
| `appraisal` (×3 variantes) | `anthropic/claude-3-haiku` |
| `analysis` | `anthropic/claude-3-5-sonnet` |
| `parent_comm` | `mistralai/mistral-7b-instruct` |
| `risk` | `anthropic/claude-3-haiku` |

**Side effects** :
- INSERT dans `ai_conversations` (si user connecté).
- Décrément du quota OpenRouter.

**Rate limit** (P3) : 50 générations / user / jour.

**Status** : 🟡 stub mock — réel à implémenter en [STEP_07](../../tasks/STEP_07.md).

---

### Server Actions login/logout — `apps/admin/src/app/login/actions.ts`

| Action | Args | Side effects |
|---|---|---|
| `signInWithPassword(fd)` | email, password | Crée session Supabase + cookie + redirect `/post-login` |
| `signInWithOAuth('google', schoolSlug)` | provider, slug | Redirect Google OAuth |
| `signOut()` | — | Supprime session + redirect `/login` |

**Status** : 🔴 à créer en [STEP_04](../../tasks/STEP_04.md).

---

### Server Actions CRUD (à créer Phase 2)

| Surface | Action | Args | RLS check |
|---|---|---|---|
| `/admin/students` | `createStudent(fd)` | first_name, last_name, class_id, level | INSERT students (RLS organisation) |
| `/admin/students` | `updateStudent(id, fd)` | id, partial | UPDATE students |
| `/admin/students` | `deleteStudent(id)` | id | DELETE students |
| `/admin/grades` | `recordGrade(fd)` | student_id, subject, value, period | INSERT grades |
| `/admin/grades` | `bulkImportGrades(csvFile)` | File | INSERT batch + ON CONFLICT update |
| `/admin/settings` | `updateOrganization(fd)` | partial Organization | UPDATE organizations (director only) |
| `/admin/settings/vitrine` | `updateVitrineSettings(fd)` | partial | UPSERT vitrine_settings |

---

## 4. Endpoints — `apps/mobile` & `apps/kids`

Pas de Route Handlers propres : les apps mobile interrogent **directement Supabase** via le SDK (`@supabase/supabase-js`) avec leur session JWT.

```ts
// Exemple — récupérer ses notes d'enfant
const { data } = await supabase
  .from('grades')
  .select('*, students!inner(*)')
  .eq('students.parent_id', userId)
  .order('recorded_at', { ascending: false })
```

RLS fait le filtrage côté DB.

Exception : pour les **opérations sensibles** (paiements, génération bulletin PDF), les apps mobile appellent un endpoint admin (`POST /api/mobile/<action>`).

---

## 5. Webhooks (P2/P3)

### `POST /api/webhooks/supabase/auth`
Reçoit les événements `user.created`, `user.confirmed`.

**Header signature** : `X-Supabase-Signature` (HMAC sha256 avec `SUPABASE_WEBHOOK_SECRET`).

**Trigger côté Supabase** : Database Webhooks → `auth.users`.

**Side effect** : crée le `profile` correspondant si absent (cas Magic Link).

---

### `POST /api/webhooks/stripe` (P3 — abonnements écoles)
Reçoit `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`.

**Header signature** : `Stripe-Signature` (validé avec `STRIPE_WEBHOOK_SECRET`).

**Side effect** : met à jour `organizations.status` (active/suspended).

---

## 6. Edge Functions Supabase

### `on_school_approved`
**Trigger** : Database trigger `AFTER UPDATE OF status ON school_requests WHEN NEW.status = 'approved'`.

**Actions** :
1. Crée une `organization` à partir des champs `slug_wanted`, `school_name`, `city`.
2. Crée un `auth.users` pour `director_email` (Magic Link envoyé).
3. Crée le `profile` avec `role='director'` + `organization_id` de la nouvelle école.
4. Envoie email Resend "Bienvenue, voici votre lien de connexion".

**Status** : 🔴 à créer P2.

---

### `cron_dropout_detection`
**Trigger** : cron hebdomadaire (`0 8 * * 1` — lundi 8h).

**Actions** :
1. Récupère tous les students `active`.
2. Pour chacun : calcule un `risk_score` (notes en baisse, absences, devoirs non rendus).
3. Si `risk_score > 70` : UPDATE `students.status = 'watch'` + email enseignant + push notification parent.

**Status** : 🔴 à créer P3.

---

## 7. Codes HTTP utilisés

| Code | Cas |
|---|---|
| `200` | Succès avec body JSON |
| `201` | Création réussie (peu utilisé — préférer 303 redirect) |
| `204` | Succès sans body (DELETE) |
| `303` | POST → GET redirect (Server Actions) |
| `400` | Validation échouée |
| `401` | Non authentifié |
| `403` | Authentifié mais rôle/tenant insuffisant |
| `404` | Ressource introuvable (orga, élève…) |
| `409` | Conflit (slug déjà pris) |
| `429` | Rate limit atteint |
| `500` | Erreur serveur (loggée Sentry P3) |

---

## 8. Patterns recommandés

### Validation des inputs (zod)

```ts
import { z } from 'zod'

const recordGradeSchema = z.object({
  student_id: z.string().uuid(),
  subject:    z.string().min(2),
  value:      z.coerce.number().min(0).max(100),
  period:     z.string().optional(),
})

export async function recordGrade(fd: FormData) {
  const parsed = recordGradeSchema.safeParse(Object.fromEntries(fd))
  if (!parsed.success) return { error: parsed.error.flatten() }
  // ... insert
}
```

### Streaming SSE pour les routes IA

```ts
export async function POST(req: Request) {
  const { messages, task } = await req.json()
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelFor(task), messages, stream: true }),
  })
  return new Response(upstream.body, { headers: { 'Content-Type': 'text/event-stream' } })
}
```

---

## 9. Liens

- 🏗️ [ARCHITECTURE](../02-architecture/ARCHITECTURE.md)
- 🗄️ [DATABASE_SCHEMA](../04-database/DATABASE_SCHEMA.md)
- 🔑 [AUTH_FLOW](../08-authentication/AUTH_FLOW.md)
- 📌 [tasks/STEP_07](../../tasks/STEP_07.md) — Implémenter `/api/ai/generate` réel
