# PERFORMANCE REPORT — EduSmart

> État de la performance actuelle + recommandations.
> **Score global initial : 5/10** (squelette non profilé, pas encore optimisé).

---

## 1. Score global

| Dimension | Note /10 | Note finale attendue |
|---|:-:|:-:|
| Bundle size web | n/a — non mesuré | viser <300 KB JS initial |
| TTFB (Time To First Byte) | 5 — Vercel default | <200 ms |
| LCP (Largest Contentful Paint) | n/a | <2.5 s |
| CLS (Cumulative Layout Shift) | n/a | <0.1 |
| Time To Interactive | n/a | <3 s |
| Cache CDN | 6 — Vercel défaut | 9 (ISR explicit) |
| DB queries | n/a — aucune réelle | <50 ms p95 |
| Realtime latency | n/a | <500 ms |
| Mobile cold start | n/a | <2 s |
| Desktop cold start | 7 — Electron honnête | 7-8 |
| **Score moyen courant** | **5/10** | **8/10 cible** |

---

## 2. Métriques cibles par surface

### Web (vitrine, admin)

| Métrique | Cible | Mesuré avec |
|---|---|---|
| LCP | < 2.5 s | Lighthouse, Vercel Speed Insights |
| FID / INP | < 100 ms | RUM |
| CLS | < 0.1 | Lighthouse |
| Bundle initial JS | < 300 KB gzipped | `@next/bundle-analyzer` |
| Premier render (RSC SSR) | < 500 ms | Vercel logs |
| DB query p95 | < 50 ms | Supabase logs |

### Mobile

| Métrique | Cible |
|---|---|
| Cold start | < 2 s |
| Frame rate | 60 fps |
| Bundle JS (Hermes) | < 5 MB |
| Time to login screen | < 1.5 s |

### Desktop

| Métrique | Cible |
|---|---|
| Cold start | < 3 s |
| Memory idle | < 250 MB |
| SQLite query | < 10 ms |
| Sync 5 min batch | < 30 s pour 500 lignes |

---

## 3. Optimisations à mettre en place

### O-01 — ISR sur les pages publiques vitrine

**Impact** : 🔴 Élevé (pages servies depuis cache CDN au lieu de SSR à chaque req).

```ts
// apps/vitrine/src/app/(page)/page.tsx
export const revalidate = 60  // re-render toutes les 60s
```

Pages concernées : `/`, `/about`, `/programs`, `/news`, `/news/[id]`.

**Effort** : inclus [STEP_05](../../tasks/STEP_05.md).

---

### O-02 — Optimisation images (`next/image`)

**Impact** : 🟡 Moyen (bandwidth ÷ 5 sur images Unsplash).

```tsx
import Image from 'next/image'

<Image src={news.cover_url} alt={news.title} width={800} height={400} priority={index === 0} />
```

`next.config.mjs` :
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: '*.supabase.co' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

**Effort** : ~2h.

---

### O-03 — Indexes PostgreSQL

**Impact** : 🔴 Élevé (queries qui passent de 500ms à 5ms).

Déjà documenté dans [DATABASE_SCHEMA §5](../04-database/DATABASE_SCHEMA.md#5-indexes-critiques-performance) :

```sql
create index idx_students_org              on students(organization_id);
create index idx_grades_student            on grades(student_id);
create index idx_grades_org_period         on grades(organization_id, period);
create index idx_news_org_published        on news_articles(organization_id, published);
create index idx_quizzes_org_published     on quizzes(organization_id, published_at);
```

**Effort** : inclus [STEP_01](../../tasks/STEP_01.md).

---

### O-04 — Découper `apps/desktop/src/App.tsx`

**Impact** : 🟡 Moyen (UI desktop plus fluide).

Le fichier mono ~1000 lignes provoque des re-renders inutiles. Découper en :
- `<DashboardHeader>` (memo)
- `<DashboardSidebar>` (memo)
- `<MetricsGrid>` (memo)
- `<TasksQueue>` (re-render sur data)
- `<StudentsTable>` (re-render sur filter)

**Effort** : ~3h ([TD-13](../12-bugs/TECH_DEBT.md#td-13--appsdesktopsrcapptsx-monolithique-1000-lignes)).

---

### O-05 — Code splitting routes admin

**Impact** : 🟡 Moyen (admin charge moins de JS initial).

Next.js App Router fait du code splitting automatique par route, mais les composants client lourds (graphs, table virtualisée) doivent être :
- en `dynamic(() => import(...), { ssr: false })`
- avec un `loading.tsx` adjacent

**Effort** : ~2h.

---

### O-06 — Cache HTTP / SWR pour mobile

**Impact** : 🟡 Moyen (UX hors-ligne mobile + moins de bandwidth).

`@tanstack/react-query` côté mobile :
```ts
const { data } = useQuery({
  queryKey: ['grades', studentId],
  queryFn: () => supabase.from('grades').select('*').eq('student_id', studentId),
  staleTime: 5 * 60 * 1000,  // 5 min
})
```

**Effort** : inclus [STEP_08](../../tasks/STEP_08.md).

---

### O-07 — Pre-compute moyennes / agrégats

**Impact** : 🔴 Élevé (dashboard admin instantané au lieu de calculer à chaque page load).

Au lieu de calculer `SUM(grades.value * coefficient) / SUM(coefficient)` à chaque dashboard, stocker une moyenne sur `students.average` mise à jour par trigger Postgres :

```sql
create or replace function update_student_average() returns trigger as $$
begin
  update students
  set average = (select sum(value * coefficient) / nullif(sum(coefficient), 0) from grades where student_id = new.student_id),
      updated_at = now()
  where id = new.student_id;
  return new;
end
$$ language plpgsql;

create trigger trg_grade_average
  after insert or update on grades
  for each row execute function update_student_average();
```

**Effort** : ~1h.

---

### O-08 — Realtime sélectif (pas Realtime sur tout)

**Impact** : 🟡 Moyen (économie connexions WebSocket + facture Supabase).

Activer Realtime uniquement sur :
- `grades` (notification parent)
- `quizzes` WHERE published (sync kids)
- `news_articles` (push notification)

Pas Realtime sur : `students`, `profiles`, `vitrine_settings`.

**Effort** : 30 min.

---

### O-09 — Sync desktop batch + delta

**Impact** : 🔴 Élevé (sync 30s au lieu de 5 min pour gros volumes).

Au lieu de SELECT * pour push, transmettre uniquement `WHERE updated_at > last_sync`.

**Effort** : inclus [STEP_10](../../tasks/STEP_10.md).

---

### O-10 — Lazy load Tailwind (purge agressif)

**Impact** : 🟡 Moyen (CSS bundle ÷ 3).

`tailwind.config.ts` :
```ts
content: [
  './src/**/*.{ts,tsx,mdx}',
  '../../packages/ui/src/**/*.{ts,tsx}',  // n'inclure que les packages réellement importés
],
```

**Effort** : 15 min vérification.

---

## 4. Outils de mesure recommandés

| Outil | Surface | Coût |
|---|---|---|
| **Lighthouse CI** | Web | gratuit |
| **Vercel Speed Insights** | Web prod (RUM) | gratuit limited |
| **`@next/bundle-analyzer`** | Bundle size | gratuit |
| **WebPageTest** | Tests synthétiques | gratuit |
| **React DevTools Profiler** | Composants lents | gratuit |
| **Supabase Logs Explorer** | Queries lentes | inclus |
| **PgHero** (extension) | Indexes manquants | optionnel |
| **Sentry Performance** | Traces RUM | gratuit limited |
| **Reactotron** | Mobile (Expo) | gratuit |

---

## 5. Budget de performance

| Page | Bundle JS gzipped | TTI cible |
|---|---|---|
| Vitrine home | < 150 KB | < 2 s |
| Admin dashboard | < 300 KB | < 3 s |
| Admin /students | < 300 KB | < 3 s |
| Admin /ai-tools (streaming) | < 350 KB | < 3 s |
| Mobile cold start | n/a | < 2 s |
| Desktop cold start | n/a | < 3 s |

**Action si dépassement** : alerte CI (P3) + investigation immédiate.

---

## 6. Mesures de validation

```bash
# Bundle analyzer
ANALYZE=true pnpm --filter @edusmart/admin build

# Lighthouse CLI (sur preview Vercel)
npx lighthouse https://edu-smart-admin-git-feature-xxx.vercel.app/students \
  --view --preset=desktop

# Supabase query stats
# Dashboard → Reports → Database → Query Performance
```

---

## 7. Liens

- 🏗️ [ARCHITECTURE](../02-architecture/ARCHITECTURE.md)
- 🗄️ [DATABASE_SCHEMA](../04-database/DATABASE_SCHEMA.md)
- 🐛 [TECH_DEBT](../12-bugs/TECH_DEBT.md)
- 📌 [tasks/STEP_14](../../tasks/STEP_14.md) — CI + monitoring
