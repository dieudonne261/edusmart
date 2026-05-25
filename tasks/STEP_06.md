# STEP 06 — Brancher l'admin sur Supabase (students, grades, settings)

> **Priorité** : 🟠 P1
> **Estimation** : 6-8 heures
> **Ordre** : après [STEP_05](STEP_05.md)

---

## 🎯 Objectif

Remplacer toute la data mockée de l'admin par Supabase. CRUD students + grades + settings (organisation, vitrine, upload logo).

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `apps/admin/src/app/page.tsx` | Dashboard KPI réels depuis Supabase |
| `apps/admin/src/app/students/page.tsx` | Liste + recherche + filtres |
| `apps/admin/src/app/students/actions.ts` _(nouveau)_ | createStudent, updateStudent, deleteStudent |
| `apps/admin/src/app/students/[id]/page.tsx` _(nouveau)_ | Fiche élève + notes + historique |
| `apps/admin/src/app/grades/page.tsx` | Grille de saisie |
| `apps/admin/src/app/grades/actions.ts` _(nouveau)_ | recordGrade, bulkImportGrades |
| `apps/admin/src/app/settings/page.tsx` | Organisation (nom, logo, couleurs) |
| `apps/admin/src/app/settings/actions.ts` _(nouveau)_ | updateOrganization, uploadLogo |
| `apps/admin/src/app/settings/vitrine/page.tsx` _(nouveau)_ | Modifier vitrine (tagline, sections, SEO) |

## 🔗 Dépendances

- Bloqué par : [STEP_03](STEP_03.md), [STEP_04](STEP_04.md).
- Bloque : [STEP_07](STEP_07.md), [STEP_11](STEP_11.md).

## ⚙️ Commandes / patterns

### Dashboard KPI

```tsx
// apps/admin/src/app/page.tsx
import { getAdminTenant } from '@/lib/admin-tenant'
import { createSupabaseServerClient } from '@edusmart/shared'

export default async function Dashboard() {
  const { organization } = await getAdminTenant()
  const supabase = createSupabaseServerClient()

  const [
    { count: studentsCount },
    { count: gradesThisWeek },
    { count: studentsAtRisk },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id),
    supabase.from('grades').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id).gte('recorded_at', oneWeekAgo()),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id).eq('status', 'watch'),
  ])

  return <DashboardKPI students={studentsCount} grades={gradesThisWeek} atRisk={studentsAtRisk} />
}
```

### Server Action create student avec validation

```ts
// apps/admin/src/app/students/actions.ts
'use server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@edusmart/shared'
import { getAdminTenant } from '@/lib/admin-tenant'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  first_name:  z.string().min(2),
  last_name:   z.string().min(2),
  class_id:    z.string().min(1),
  level:       z.string().optional(),
})

export async function createStudent(fd: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(fd))
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { organization } = await getAdminTenant()
  const supabase = createSupabaseServerClient()
  const student_code = `${organization.slug.toUpperCase()}-${Date.now()}`

  const { error } = await supabase.from('students').insert({
    ...parsed.data,
    organization_id: organization.id,
    student_code,
    status: 'active',
  })
  if (error) return { error: error.message }

  revalidatePath('/students')
  return { success: true }
}
```

### Upload logo → Supabase Storage

```ts
export async function uploadLogo(file: File) {
  const { organization } = await getAdminTenant()
  const supabase = createSupabaseServerClient()
  const path = `${organization.id}/logo-${Date.now()}.png`

  const { error: upErr } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
  if (upErr) return { error: upErr.message }

  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
  await supabase.from('organizations').update({ logo_url: publicUrl }).eq('id', organization.id)
  revalidatePath('/settings')
  return { url: publicUrl }
}
```

## ⚠️ Risques

| Risque | Mitigation |
|---|---|
| User teacher modifie un élève d'une autre classe | RLS + check `class_id` côté Server Action |
| Bulk import CSV trop gros → timeout | Batch par 100 lignes |
| Upload logo > 2 MB → bandwidth | Vérifier `file.size` côté Server Action |

## ✅ Validation

- [ ] Dashboard affiche les vrais counts.
- [ ] CRUD students fonctionne (RLS bloque cross-tenant).
- [ ] Saisie note → ligne en DB + moyenne updated via trigger.
- [ ] Upload logo visible immédiatement.

## ➡️ Prochaine étape

→ [STEP_07](STEP_07.md) — IA OpenRouter réelle.
