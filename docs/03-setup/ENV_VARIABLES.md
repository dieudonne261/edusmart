# ENV VARIABLES — EduSmart

> Référence complète des variables d'environnement nécessaires pour chaque environnement (local, Vercel preview, Vercel production, EAS mobile, builds desktop).

---

## 1. Convention

- `NEXT_PUBLIC_*` → exposée au browser (visible dans le bundle JS).
- Sans préfixe → **server-only**, ne JAMAIS exposer côté client.
- Stockée dans :
  - **Local dev** : `.env` (gitignored), à la racine du monorepo.
  - **Vercel** : Project Settings → Environment Variables (séparées par environnement).
  - **GitHub Actions** : `secrets.GITHUB_TOKEN`-style + repo secrets.
  - **EAS** : `eas.json` (build-time) + Expo dashboard (runtime).
  - **Electron prod** : injectées via `electron-builder` + `electron-store` chiffré pour les valeurs sensibles.

---

## 2. Référence complète

### 🗄️ Supabase

| Variable | Type | Usage | Exemple |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL du projet (toutes apps) | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | JWT anonyme (toutes apps client + server) | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** | Bypass RLS, server-only | `eyJhbGciOi...` |
| `NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL` | public | URL absolue du callback OAuth | `https://edusmart.site/auth/callback` |

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` ne doit JAMAIS être préfixée `NEXT_PUBLIC_`** ni utilisée dans un fichier qui commence par `'use client'`.

### 🤖 IA

| Variable | Type | Usage | Exemple |
|---|---|---|---|
| `OPENROUTER_API_KEY` | **secret** | Appels server-side `/api/ai/*` | `sk-or-v1-...` |
| `OPENROUTER_SITE_URL` | public/optionnel | Identifiant site pour métriques | `https://edusmart.site` |
| `OPENROUTER_APP_NAME` | public/optionnel | Affiché dans rate-limit headers | `EduSmart` |

### 📧 Email

| Variable | Type | Usage | Exemple |
|---|---|---|---|
| `RESEND_API_KEY` | **secret** | Emails transactionnels (contact, school_requests) | `re_...` |
| `RESEND_FROM` | public | Adresse expéditeur par défaut | `EduSmart <noreply@edusmart.site>` |
| `LWS_SMTP_HOST` | optionnel | Pour notifications internes via LWS | `mail.edusmart.site` |
| `LWS_SMTP_USER` | **secret** |  | `noreply@edusmart.site` |
| `LWS_SMTP_PASS` | **secret** |  | `***` |

### 📱 SMS

| Variable | Type | Usage |
|---|---|---|
| `AFRICASTALKING_USERNAME` | **secret** | Compte Africa's Talking |
| `AFRICASTALKING_API_KEY` | **secret** | Clé API |
| `AFRICASTALKING_SENDER_ID` | public | Nom court SMS (ex: `EduSmart`) |
| `TWILIO_ACCOUNT_SID` | **secret** | Alternative Twilio (international) |
| `TWILIO_AUTH_TOKEN` | **secret** | — |
| `TWILIO_PHONE_NUMBER` | public | — |

### 🔐 OAuth Google

| Variable | Type | Usage |
|---|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | public | 1 seul credential pour toutes écoles |
| `GOOGLE_OAUTH_CLIENT_SECRET` | **secret** | Server-side uniquement |

> Configuré côté Supabase Auth (pas besoin de Server Action manuelle).

### 🌐 Domaine & infra

| Variable | Type | Usage | Exemple |
|---|---|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | public | Détection sous-domaine vs racine | `edusmart.site` |
| `NEXT_PUBLIC_APP_ENV` | public | Bannière "DEV", "PREVIEW", "PROD" | `production` |
| `VERCEL_URL` | auto Vercel | URL preview (auto-fourni par Vercel) | `edu-smart-xyz.vercel.app` |

### 📊 Monitoring (P3)

| Variable | Type | Usage |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | public | Sentry browser SDK |
| `SENTRY_AUTH_TOKEN` | **secret** | Upload sourcemaps |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | public | Analytics privacy-first |

### 💳 Paiements (P3, futur)

| Variable | Type | Usage |
|---|---|---|
| `STRIPE_SECRET_KEY` | **secret** | Abonnements écoles (B2B) |
| `STRIPE_WEBHOOK_SECRET` | **secret** | Validation webhooks |
| `NEXT_PUBLIC_STRIPE_PK` | public | Stripe Elements client |

---

## 3. Par environnement — qui a besoin de quoi

| Variable | Local `.env` | Vercel Production | Vercel Preview | EAS mobile | Desktop prod |
|---|:-:|:-:|:-:|:-:|:-:|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | ✅ | ✅ (embed) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | ✅ | ✅ (embed) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ❌ (preview = safer) | ❌ | ❌ |
| `OPENROUTER_API_KEY` | ✅ | ✅ | ✅ | ❌ (passe par admin) | ❌ |
| `RESEND_API_KEY` | ✅ | ✅ | ❌ (évite spam preview) | ❌ | ❌ |
| `NEXT_PUBLIC_ROOT_DOMAIN` | ✅ | ✅ (`edusmart.site`) | ✅ (preview-id.vercel.app) | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL` | ✅ | ✅ | ✅ (override) | ✅ | ❌ |

---

## 4. Cycle de rotation des secrets

| Secret | Fréquence | Procédure |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Tous les 6 mois (ou en cas de fuite) | Dashboard Supabase → "Reset service_role" |
| `OPENROUTER_API_KEY` | 6 mois | Dashboard OpenRouter → delete + new |
| `RESEND_API_KEY` | 6 mois |  |
| Mot de passe Postgres | 12 mois | Supabase → DB Settings → Reset password |
| Tokens auth users | auto | Supabase rotate refresh tokens automatiquement |

---

## 5. Anti-patterns à éviter

| ❌ Mauvais | ✅ Bon |
|---|---|
| `NEXT_PUBLIC_OPENROUTER_KEY` (exposé browser) | `OPENROUTER_API_KEY` server-only, route handler proxy |
| `.env` commité dans le repo | `.env.example` avec placeholders, `.env` ignoré |
| Clés copiées-collées dans Slack/Discord | Vault (1Password / Bitwarden) partagé en équipe |
| `process.env.X!` sans validation | `zod`-based validation au boot de l'app |
| Différentes valeurs Supabase en Preview vs Prod (par accident) | Naming clair : `<service>_<env>` ou utiliser Vercel "Environments" |

---

## 6. Script de validation au boot (recommandé Phase 2)

```ts
// packages/shared/src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:        z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY:   z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY:       z.string().min(10).optional(),  // optional côté client
  OPENROUTER_API_KEY:              z.string().min(10).optional(),
  RESEND_API_KEY:                  z.string().min(10).optional(),
  NEXT_PUBLIC_ROOT_DOMAIN:         z.string().default('edusmart.site'),
})

export const env = envSchema.parse(process.env)
```

---

## 7. Audit rapide

```bash
# Vérifier qu'aucune clé réelle n'est dans le repo
git grep -nE "(eyJ[A-Za-z0-9_-]{30,}|re_[A-Za-z0-9]{20,}|sk-or-v1-[A-Za-z0-9]{40,})"

# Lister les variables utilisées dans le code
git grep -nE "process\.env\.[A-Z_]+" -- '*.ts' '*.tsx' | sort -u
```

---

## Liens

- ⚙️ [SETUP_GUIDE](SETUP_GUIDE.md)
- 🛡️ [SECURITY_REPORT](../14-security/SECURITY_REPORT.md)
- 📌 [tasks/STEP_02](../../tasks/STEP_02.md) — Sécuriser les secrets
