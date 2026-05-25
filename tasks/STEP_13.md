# STEP 13 — Tests automatisés (Vitest unitaires + Playwright E2E)

> **Priorité** : 🟢 P3 (mais à faire avant pilote prod)
> **Estimation** : 12-16 heures
> **Ordre** : peut être lancé en parallèle après [STEP_06](STEP_06.md)

## 🎯 Objectif

Mettre en place :
- **Vitest** pour les tests unitaires (~20 sur `packages/shared`) + intégration (~10 sur Server Actions).
- **Playwright** pour 5 scénarios E2E critiques.

## 📦 Fichiers concernés (nouveaux)

```
vitest.config.ts                ← racine
playwright.config.ts            ← racine
test/
├── fixtures/
│   ├── organizations.ts        ← STRELITZIA + UAZ
│   ├── students.ts             ← 5 élèves
│   └── grades.ts                ← 20 notes
└── mocks/
    └── handlers.ts             ← MSW

packages/shared/src/utils/*.test.ts
apps/admin/src/app/students/actions.test.ts
apps/admin/src/lib/admin-tenant.test.ts

e2e/
├── admin-login.spec.ts
├── multi-tenant.spec.ts
├── student-crud.spec.ts
├── grade-entry.spec.ts
└── ai-tools.spec.ts
```

## ⚙️ Setup

```bash
# Racine
pnpm add -D -w vitest @vitest/coverage-v8 happy-dom @testing-library/react @testing-library/jest-dom msw
pnpm add -D -w @playwright/test
npx playwright install chromium
```

## ⚙️ `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: { lines: 60, statements: 60 },
    },
  },
})
```

## ⚙️ Tests unitaires prioritaires

```ts
// packages/shared/src/utils/gradeCalc.test.ts
import { describe, it, expect } from 'vitest'
import { calculateAverage } from './gradeCalc'

describe('calculateAverage', () => {
  it('moyenne pondérée correcte', () => {
    expect(calculateAverage([
      { value: 12, max_value: 20, coefficient: 2 },
      { value: 16, max_value: 20, coefficient: 1 },
    ])).toBeCloseTo(13.33, 1)
  })
  it('normalise quand max_value ≠ 20', () => {
    expect(calculateAverage([{ value: 8, max_value: 10, coefficient: 1 }])).toBe(16)
  })
  it('retourne 0 si vide', () => {
    expect(calculateAverage([])).toBe(0)
  })
})
```

## ⚙️ Tests intégration Server Action

```ts
// apps/admin/src/app/students/actions.test.ts
import { describe, it, expect, vi } from 'vitest'
import { createStudent } from './actions'

vi.mock('@edusmart/shared', () => ({
  createSupabaseServerClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: [{ id: 'mock' }], error: null }),
    }),
  }),
}))
vi.mock('@/lib/admin-tenant', () => ({
  getAdminTenant: () => ({ organization: { id: 'orga-1', slug: 'strelitzia' } }),
}))

describe('createStudent', () => {
  it('refuse first_name vide', async () => {
    const fd = new FormData()
    fd.set('last_name', 'Rakoto')
    const res = await createStudent(fd)
    expect(res.error).toBeDefined()
  })
  it('accepte payload complet', async () => {
    const fd = new FormData()
    fd.set('first_name', 'Miora')
    fd.set('last_name',  'Rakoto')
    fd.set('class_id',   '6e A')
    const res = await createStudent(fd)
    expect(res.success).toBe(true)
  })
})
```

## ⚙️ Tests E2E Playwright

```ts
// e2e/multi-tenant.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Multi-tenant isolation', () => {
  test('STRELITZIA voit ses élèves', async ({ page }) => {
    await page.goto('http://localhost:3002/students?school=strelitzia')
    await loginAs(page, 'directeur@strelitzia.test')
    await expect(page.locator('table')).toContainText('Miora Rakoto')
  })

  test('UAZ ne voit PAS les élèves STRELITZIA', async ({ page }) => {
    await page.goto('http://localhost:3002/students?school=uaz')
    await loginAs(page, 'directeur@uaz.test')
    await expect(page.locator('table')).not.toContainText('Miora Rakoto')
  })

  test('Tentative cross-tenant bloquée', async ({ page, context }) => {
    await loginAs(page, 'directeur@strelitzia.test')
    await page.goto('http://localhost:3002/students?school=uaz')
    await expect(page).toHaveURL(/\/forbidden$/)
  })
})

async function loginAs(page, email: string) {
  await page.goto('/login')
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', process.env.TEST_PASSWORD!)
  await page.click('button[type=submit]')
  await page.waitForURL(/\/.*$/)
}
```

## ⚙️ `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3002', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'pnpm --filter @edusmart/admin dev',
    port: 3002, reuseExistingServer: !process.env.CI,
  },
})
```

## ⚙️ Scripts package.json racine

```json
{
  "scripts": {
    "test":          "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e":      "playwright test",
    "test:e2e:ui":   "playwright test --ui"
  }
}
```

## ✅ Validation

- [ ] `pnpm test` passe (20+ tests verts).
- [ ] `pnpm test:coverage` génère `coverage/index.html` avec ≥ 60 % lines.
- [ ] `pnpm test:e2e` passe les 5 scénarios.
- [ ] CI échoue si un test casse.

## ➡️ Prochaine étape

→ [STEP_14](STEP_14.md) — CI étendue + monitoring.
