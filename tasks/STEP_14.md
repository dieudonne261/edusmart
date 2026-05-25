# STEP 14 — CI étendue + Sentry + rate-limit + Edge Functions

> **Priorité** : 🟢 P3
> **Estimation** : 8-10 heures
> **Ordre** : après [STEP_13](STEP_13.md)

## 🎯 Objectif

Industrialiser :
- **CI** étendue : type-check + build + lint + tests pour toutes les apps.
- **Sentry** : monitoring erreurs web + mobile.
- **Rate-limit** : Upstash Redis sur `/api/chat`, `/api/ai/generate`, `/api/contact`, login attempts.
- **Edge Functions Supabase** : `on_school_approved`, `push_on_grade`, `cron_dropout_detection`.
- **Vercel Analytics + Plausible** (privacy-first).

## 📦 Fichiers concernés (nouveaux)

```
.github/workflows/
├── ci.yml                ← étendre (lint + tests + matrice apps)
├── e2e.yml               ← Playwright sur PR
├── deps-audit.yml         ← pnpm audit hebdo

apps/admin/sentry.client.config.ts
apps/admin/sentry.server.config.ts
apps/admin/sentry.edge.config.ts
apps/admin/instrumentation.ts
apps/vitrine/{sentry,instrumentation}.*

apps/mobile/app/_layout.tsx       (init Sentry React Native)

lib/ratelimit.ts                  (Upstash)

supabase/functions/
├── on_school_approved/index.ts
├── push_on_grade/index.ts
└── cron_dropout_detection/index.ts
```

## ⚙️ CI étendue

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm -r type-check
      - run: pnpm test --coverage

  build:
    needs: lint-test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [admin, vitrine, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @edusmart/${{ matrix.app }} build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_ROOT_DOMAIN: edusmart.site
```

## ⚙️ Sentry — Next.js

```bash
pnpm --filter @edusmart/admin add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

`sentry.client.config.ts` :
```ts
import * as Sentry from '@sentry/nextjs'
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? 'development',
})
```

## ⚙️ Rate-limit Upstash

```bash
pnpm --filter @edusmart/admin add @upstash/redis @upstash/ratelimit
```

```ts
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 d'),  // 50/user/jour
  analytics: true, prefix: 'ai',
})
export const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),  // 10/IP/h
  analytics: true, prefix: 'chat',
})
```

Usage :
```ts
export async function POST(req: NextRequest) {
  const profile = await getCurrentProfile()
  const { success } = await aiRatelimit.limit(profile.id)
  if (!success) return new NextResponse('Quota épuisé', { status: 429 })
  // ...
}
```

## ⚙️ Edge Function `on_school_approved`

```ts
// supabase/functions/on_school_approved/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const { record, old_record } = await req.json()
  if (record.status !== 'approved' || old_record?.status === 'approved') return new Response('skip')

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // 1. Créer organization
  const { data: org } = await supabase.from('organizations').insert({
    slug: record.slug_wanted,
    name: record.school_name,
    city: record.city,
    status: 'active',
  }).select().single()

  // 2. Inviter le director via Magic Link
  const { data: invitation } = await supabase.auth.admin.inviteUserByEmail(record.director_email, {
    data: { full_name: 'Directeur', role: 'director' },
    redirectTo: `https://${org.slug}.edusmart.site/admin`,
  })

  // 3. Créer profile (le user existe maintenant)
  await supabase.from('profiles').insert({
    id: invitation.user.id,
    organization_id: org.id,
    role: 'director',
    full_name: 'Directeur',
  })

  return new Response('OK')
})
```

Déploiement :
```bash
npx supabase functions deploy on_school_approved
# Database Webhook : school_requests UPDATE → POST .../functions/v1/on_school_approved
```

## ⚙️ Plausible (analytics privacy-first)

```html
<!-- apps/vitrine/src/app/layout.tsx -->
<script defer data-domain="edusmart.site" src="https://plausible.io/js/script.js"></script>
```

## ✅ Validation

- [ ] CI verte sur PR (lint + tests + 3 builds).
- [ ] Sentry capte une erreur volontaire.
- [ ] Rate-limit 429 après dépassement.
- [ ] `on_school_approved` crée orga + invite director.
- [ ] Plausible affiche les visites.

## ➡️ Prochaine étape

→ [STEP_15](STEP_15.md) — Déploiement production multi-école.
